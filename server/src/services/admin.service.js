const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (dept_id) => {
  const stats = {
    totalStudents: 0,
    totalFaculty: 0,
    activeSections: 0,
    totalChannels: 0,
    messagesToday: 0,
    totalMemberships: 0,
    totalClubs: 0,
    pendingReports: 0,
    suspendedUsers: 0,
    messageHistory: []
  };

  try {
    // 1-4. Basic Counts
    const [students] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "student" AND (dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
    const [faculty] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE role = "faculty" AND (dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
    const [sections] = await pool.execute('SELECT COUNT(*) as count FROM sections WHERE (dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
    const [suspended] = await pool.execute('SELECT COUNT(*) as count FROM users WHERE is_active = 0 AND (dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
    
    // Detailed Channel Counts
    const [chanTotal] = await pool.execute('SELECT COUNT(*) as count FROM channels WHERE (dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
    const [chanSection] = await pool.execute('SELECT COUNT(*) as count FROM channels WHERE (dept_id = ? OR ? IS NULL) AND type = "section"', [dept_id, dept_id]);
    const [chanSubject] = await pool.execute('SELECT COUNT(*) as count FROM channels WHERE (dept_id = ? OR ? IS NULL) AND type = "subject"', [dept_id, dept_id]);
    const [chanAnnounce] = await pool.execute('SELECT COUNT(*) as count FROM channels WHERE (dept_id = ? OR ? IS NULL) AND (type = "announcement" OR type = "branch" OR type = "general" OR type = "club")', [dept_id, dept_id]);

    stats.totalStudents = students[0]?.count || 0;
    stats.totalFaculty = faculty[0]?.count || 0;
    stats.activeSectionsCount = sections[0]?.count || 0;
    stats.suspendedUsers = suspended[0]?.count || 0;
    
    stats.channels = {
      total: chanTotal[0]?.count || 0,
      sections: chanSection[0]?.count || 0,
      subjects: chanSubject[0]?.count || 0,
      announcements: chanAnnounce[0]?.count || 0
    };

    const [mRows] = await pool.execute(`
      SELECT COUNT(DISTINCT user_id) as count FROM (
        SELECT user_id FROM channel_members cm JOIN channels c ON cm.channel_id = c.id WHERE (c.dept_id = ? OR ? IS NULL)
        UNION
        SELECT id as user_id FROM users WHERE section_id IS NOT NULL AND (dept_id = ? OR ? IS NULL)
      ) as sub`, [dept_id, dept_id, dept_id, dept_id]);

    stats.totalMemberships = mRows[0]?.count || 0;

    // 5. Messages Today (Dual Support)
    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM messages m JOIN channels c ON m.channel_id = c.id WHERE DATE(m.created_at) = CURRENT_DATE AND (c.dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
      stats.messagesToday = rows[0]?.count || 0;
    } catch (e) {
      try {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM messages m JOIN channels c ON m.channel_id = c.id WHERE date(m.created_at) = date("now") AND (c.dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
        stats.messagesToday = rows[0]?.count || 0;
      } catch (e2) {}
    }

    // 7-8. Clubs and Reports (Optional Tables)
    try {
      const [cRows] = await pool.execute('SELECT COUNT(*) as count FROM clubs WHERE (dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
      stats.totalClubs = cRows[0]?.count || 0;
    } catch (e) {}

    try {
      const [rRows] = await pool.execute('SELECT COUNT(*) as count FROM channel_reports r JOIN messages m ON r.message_id = m.id JOIN channels c ON m.channel_id = c.id WHERE r.status = "pending" AND (c.dept_id = ? OR ? IS NULL)', [dept_id, dept_id]);
      stats.pendingReports = rRows[0]?.count || 0;
    } catch (e) {}

    // 10. Message History (Dual Support)
    try {
      const [hRows] = await pool.execute('SELECT DATE(m.created_at) as date, COUNT(*) as count FROM messages m JOIN channels c ON m.channel_id = c.id WHERE (c.dept_id = ? OR ? IS NULL) AND m.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY) GROUP BY DATE(m.created_at) ORDER BY date ASC', [dept_id, dept_id]);
      stats.messageHistory = hRows;
    } catch (e) {
      try {
        const [hRows] = await pool.execute('SELECT date(m.created_at) as date, COUNT(*) as count FROM messages m JOIN channels c ON m.channel_id = c.id WHERE (c.dept_id = ? OR ? IS NULL) AND m.created_at >= date("now", "-7 days") GROUP BY date(m.created_at) ORDER BY date ASC', [dept_id, dept_id]);
        stats.messageHistory = hRows;
      } catch (e2) {}
    }

  } catch (err) {
    console.error('Fatal Dashboard Stats Error:', err.message);
  }

  return { ...stats, totalUsers: stats.totalStudents + stats.totalFaculty };
};

const getRecentAnnouncements = async (dept_id) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        a.id, a.title, a.content, a.type, a.visibility, a.created_at,
        u.name as author_name,
        d.name as dept_name,
        s.name as section_name
       FROM announcements a
       JOIN users u ON a.created_by = u.id
       LEFT JOIN departments d ON a.target_dept_id = d.id
       LEFT JOIN sections s ON a.target_section_id = s.id
       WHERE (a.target_dept_id = ? OR ? IS NULL OR a.visibility = 'all') AND a.is_active = 1
       ORDER BY a.created_at DESC LIMIT 5`,
      [dept_id, dept_id]
    );
    return rows.map(row => ({
      ...row,
      channel_name: row.visibility === 'section' ? row.section_name : (row.visibility === 'department' ? row.dept_name : 'All'),
      reach: 0
    }));
  } catch (err) {
    console.error('getRecentAnnouncements error:', err.message);
    return [];
  }
};

const getUserActivity = async (dept_id) => {
  try {
    const [users] = await pool.execute(
      `SELECT name as detail, created_at, 'joined' as action, 'user' as type, role
       FROM users WHERE (dept_id = ? OR ? IS NULL) 
       ORDER BY created_at DESC LIMIT 5`,
      [dept_id, dept_id]
    );

    const [msgs] = await pool.execute(
      `SELECT m.content as detail, m.created_at, 'posted' as action, 'announcement' as type, c.name as channel_name
       FROM messages m
       JOIN channels c ON m.channel_id = c.id
       WHERE (c.dept_id = ? OR ? IS NULL) AND m.type = "announcement"
       ORDER BY m.created_at DESC LIMIT 3`,
      [dept_id, dept_id]
    );

    const activity = [...users, ...msgs];
    return activity.sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);
  } catch (err) {
    console.error('Activity fetch error:', err.message);
    return [];
  }
};

const getChannels = async (dept_id = null, type = null) => {
  try {
    let sql = `
      SELECT 
        c.*, 
        CASE 
          WHEN c.type = 'section' THEN (SELECT COUNT(*) FROM users u WHERE u.section_id = c.section_id AND u.role = 'student')
          ELSE (SELECT COUNT(*) FROM channel_members cm WHERE cm.channel_id = c.id)
        END as members
      FROM channels c`;
    const params = [];

    const whereClauses = [];
    if (dept_id) {
      whereClauses.push('(c.dept_id = ? OR ? IS NULL)');
      params.push(dept_id, dept_id);
    }
    if (type) {
      if (type === 'announcement') {
        whereClauses.push('(c.type = "announcement" OR c.type = "branch" OR c.type = "general")');
      } else {
        whereClauses.push('c.type = ?');
        params.push(type);
      }
    }

    if (whereClauses.length > 0) {
      sql += ' WHERE ' + whereClauses.join(' AND ');
    }

    sql += ' ORDER BY c.created_at DESC';

    const [rows] = await pool.execute(sql, params);
    return rows || [];
  } catch (err) {
    console.error('getChannels error:', err.message);
    return [];
  }
};

const createChannel = async ({ dept_id, creator_id, name, type = 'announcement', description = '', visibility = 'department' }) => {
  try {
    const [result] = await pool.execute(
      'INSERT INTO channels (name, description, type, visibility, dept_id, creator_id) VALUES (?, ?, ?, ?, ?, ?)',
      [name.trim(), description.trim(), type, visibility, dept_id, creator_id]
    );
    const channelId = result.insertId;
    
    // Auto-add creator as owner
    await pool.execute(
      'INSERT IGNORE INTO channel_members (channel_id, user_id, role) VALUES (?, ?, ?)',
      [channelId, creator_id, 'owner']
    );

    return { id: channelId, name: name.trim(), type, description, visibility };
  } catch (err) {
    console.error('createChannel error:', err.message);
    throw err;
  }
};

const getClubs = async (dept_id) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.*, ch.id as channel_id, ch.name as channel_name 
       FROM clubs c 
       LEFT JOIN channels ch ON c.channel_id = ch.id 
       WHERE (c.dept_id = ? OR ? IS NULL)`,
      [dept_id, dept_id]
    );
    return rows || [];
  } catch (err) {
    console.error('getClubs error:', err.message);
    return [];
  }
};

const createClub = async ({ dept_id, creator_id, name, description, category }) => {
  try {
    const [chanResult] = await pool.execute(
      'INSERT INTO channels (name, type, dept_id, creator_id) VALUES (?, "club", ?, ?)',
      [`Club: ${name}`, dept_id, creator_id]
    );
    const channelId = chanResult.insertId;

    // Auto-add creator as owner
    await pool.execute(
      'INSERT IGNORE INTO channel_members (channel_id, user_id, role) VALUES (?, ?, ?)',
      [channelId, creator_id, 'owner']
    );

    const [result] = await pool.execute(
      'INSERT INTO clubs (name, description, category, dept_id, channel_id) VALUES (?, ?, ?, ?, ?)',
      [name, description, category, dept_id, channelId]
    );

    return { id: result.insertId, name, channel_id: channelId };
  } catch (err) {
    console.error('createClub error:', err.message);
    throw err;
  }
};

const updateClub = async (id, data) => {
  try {
    const { name, description, category } = data;
    await pool.execute(
      'UPDATE clubs SET name = ?, description = ?, category = ? WHERE id = ?',
      [name, description, category, id]
    );
    return { id, ...data };
  } catch (err) {
    console.error('updateClub error:', err.message);
    throw err;
  }
};

const deleteClub = async (id) => {
  try {
    const [rows] = await pool.execute('SELECT channel_id FROM clubs WHERE id = ?', [id]);
    if (rows.length > 0) {
      const channelId = rows[0].channel_id;
      await pool.execute('DELETE FROM channels WHERE id = ?', [channelId]);
    }
    await pool.execute('DELETE FROM clubs WHERE id = ?', [id]);
    return { success: true };
  } catch (err) {
    console.error('deleteClub error:', err.message);
    throw err;
  }
};

const deleteChannel = async (id) => {
  try {
    await pool.execute('DELETE FROM channels WHERE id = ?', [id]);
    return { success: true };
  } catch (err) {
    console.error('deleteChannel error:', err.message);
    throw err;
  }
};

const getReports = async (dept_id) => {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        r.*, m.content as message_content,
        u_reporter.name as reporter_name, u_reported.name as reported_name,
        c.name as channel_name
      FROM channel_reports r
      JOIN messages m ON r.message_id = m.id
      JOIN users u_reporter ON r.reporter_id = u_reporter.id
      JOIN users u_reported ON m.sender_id = u_reported.id
      JOIN channels c ON m.channel_id = c.id
      WHERE (c.dept_id = ? OR ? IS NULL) AND r.status = 'pending'
      ORDER BY r.created_at DESC`,
      [dept_id, dept_id]
    );
    return rows || [];
  } catch (err) {
    console.error('getReports error:', err.message);
    return [];
  }
};

const resolveReport = async (reportId, action) => {
  try {
    const [reportRows] = await pool.execute('SELECT message_id FROM channel_reports WHERE id = ?', [reportId]);
    if (reportRows.length > 0 && action === 'delete') {
      const messageId = reportRows[0].message_id;
      await pool.execute('DELETE FROM messages WHERE id = ?', [messageId]);
    }
    await pool.execute("UPDATE channel_reports SET status = ? WHERE id = ?", [action === 'dismiss' ? 'dismissed' : 'resolved', reportId]);
    return { success: true };
  } catch (err) {
    console.error('resolveReport error:', err.message);
    throw err;
  }
};

const getStudents = async ({ dept_id, search = '', section_id, verification_status, is_active, page = 1, limit = 20 }) => {
  try {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const offset = (safePage - 1) * safeLimit;

    const whereClauses = ['u.role = "student"', '(u.dept_id = ? OR ? IS NULL)'];
    const params = [dept_id, dept_id];

    if (search && search.trim()) {
      const like = `%${search.trim()}%`;
      whereClauses.push('(u.name LIKE ? OR u.email LIKE ? OR u.reg_no LIKE ? OR u.enrollment_no LIKE ?)');
      params.push(like, like, like, like);
    }
    if (section_id) { whereClauses.push('u.section_id = ?'); params.push(section_id); }
    if (verification_status) { whereClauses.push('u.verification_status = ?'); params.push(verification_status); }
    if (is_active !== undefined && is_active !== null && is_active !== '') {
      whereClauses.push('u.is_active = ?'); params.push(Number(is_active) ? 1 : 0);
    }

    const whereSql = whereClauses.join(' AND ');
    const [students] = await pool.execute(`SELECT u.*, s.name AS section_name, d.name AS dept_name FROM users u LEFT JOIN sections s ON s.id = u.section_id LEFT JOIN departments d ON d.id = u.dept_id WHERE ${whereSql} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`, [...params, safeLimit, offset]);
    const [countRows] = await pool.execute(`SELECT COUNT(*) AS total FROM users u WHERE ${whereSql}`, params);
    const [sections] = await pool.execute('SELECT id, name FROM sections WHERE (dept_id = ? OR ? IS NULL) ORDER BY name ASC', [dept_id, dept_id]);

    const total = Number(countRows[0]?.total || 0);

    return { 
      students: students || [], 
      filters: { sections: sections || [] },
      pagination: { 
        page: safePage, 
        limit: safeLimit, 
        total, 
        totalPages: Math.ceil(total / safeLimit) || 1 
      } 
    };
  } catch (err) {
    console.error('getStudents error:', err.message);
    return { students: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
  }
};

const getFaculty = async ({ dept_id, search = '', is_active, page = 1, limit = 20 }) => {
  try {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
    const offset = (safePage - 1) * safeLimit;

    const whereClauses = ['u.role = "faculty"', '(u.dept_id = ? OR ? IS NULL)'];
    const params = [dept_id, dept_id];

    if (search && search.trim()) {
      const like = `%${search.trim()}%`;
      whereClauses.push('(u.name LIKE ? OR u.email LIKE ? OR u.reg_no LIKE ?)');
      params.push(like, like, like);
    }
    if (is_active !== undefined && is_active !== null && is_active !== '') {
      whereClauses.push('u.is_active = ?'); params.push(Number(is_active) ? 1 : 0);
    }

    const whereSql = whereClauses.join(' AND ');
    const [rows] = await pool.execute(`SELECT u.*, d.name AS dept_name FROM users u LEFT JOIN departments d ON d.id = u.dept_id WHERE ${whereSql} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`, [...params, safeLimit, offset]);
    
    // Add subjects and sections
    const faculty = await Promise.all(rows.map(async (row) => {
      const [sections] = await pool.execute('SELECT DISTINCT s.name FROM sections s JOIN subject_offerings so ON so.section_id = s.id WHERE so.faculty_id = ?', [row.id]);
      const [subjects] = await pool.execute('SELECT DISTINCT s.name FROM subjects s JOIN subject_offerings so ON so.subject_id = s.id WHERE so.faculty_id = ?', [row.id]);
      return { ...row, assignedSections: sections.map(s => s.name), subjects: subjects.map(s => s.name) };
    }));

    const [countRows] = await pool.execute(`SELECT COUNT(*) AS total FROM users u WHERE ${whereSql}`, params);
    const total = Number(countRows[0]?.total || 0);

    return { faculty, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) || 1 } };
  } catch (err) {
    console.error('getFaculty error:', err.message);
    return { faculty: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 1 } };
  }
};

const createUserByRole = async ({ dept_id, role, data }) => {
  const name = data?.name?.trim() || null;
  const email = data?.email?.trim()?.toLowerCase() || null;
  const password = data?.password || null;
  const regNo = data?.reg_no?.trim() || null;
  const enrollmentNo = data?.enrollment_no?.trim() || null;
  const verificationStatus = data?.verification_status === 'verified' ? 'verified' : 'pending';
  const isActive = Number(data?.is_active) === 0 ? 0 : 1;
  const sectionId = data?.section_id ? Number(data.section_id) : null;

  if (!name) throw new Error('Name is required');
  if (!role) throw new Error('Role is required');

  let hashedPassword = null;
  if (role !== 'student') {
    const actualPassword = String(password || regNo || enrollmentNo || '123456');
    hashedPassword = await bcrypt.hash(actualPassword, 10);
  }

  const [result] = await pool.execute(
    'INSERT INTO users (name, email, reg_no, enrollment_no, role, dept_id, section_id, password, verification_status, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, regNo, enrollmentNo, role, dept_id, role === 'student' ? sectionId : null, hashedPassword || '', verificationStatus, isActive]
  );

  const [rows] = await pool.execute('SELECT u.*, d.name AS dept_name, s.name AS section_name FROM users u LEFT JOIN departments d ON d.id = u.dept_id LEFT JOIN sections s ON s.id = u.section_id WHERE u.id = ?', [result.insertId]);
  return rows[0];
};

const createStudent = async ({ dept_id, data }) => createUserByRole({ dept_id, role: 'student', data });
const createFaculty = async ({ dept_id, data }) => createUserByRole({ dept_id, role: 'faculty', data });

const getDepartments = async (deptId = null) => {
  if (deptId) {
    const [rows] = await pool.execute('SELECT * FROM departments WHERE id = ?', [deptId]);
    return rows;
  }
  const [rows] = await pool.execute('SELECT * FROM departments ORDER BY name ASC');
  return rows;
};

const createDepartment = async (name, creator_id) => {
  const [result] = await pool.execute('INSERT INTO departments (name) VALUES (?)', [name.trim()]);
  const [chanRes] = await pool.execute('INSERT INTO channels (name, type, dept_id, creator_id) VALUES (?, "branch", ?, ?)', [`${name.trim()} - All`, result.insertId, creator_id]);
  
  await pool.execute('INSERT IGNORE INTO channel_members (channel_id, user_id, role) VALUES (?, ?, ?)', [chanRes.insertId, creator_id, 'owner']);
  
  return { id: result.insertId, name: name.trim() };
};

const getSections = async (dept_id) => {
  const [rows] = await pool.execute('SELECT s.*, d.name as dept_name FROM sections s JOIN departments d ON s.dept_id = d.id WHERE s.dept_id = ? ORDER BY s.name ASC', [dept_id]);
  return rows;
};

const createSection = async ({ dept_id, creator_id, name }) => {
  const [result] = await pool.execute('INSERT INTO sections (name, dept_id) VALUES (?, ?)', [name.trim(), dept_id]);
  const sectionId = result.insertId;
  const [deptRows] = await pool.execute('SELECT name FROM departments WHERE id = ?', [dept_id]);
  const [chanRes] = await pool.execute('INSERT INTO channels (name, type, dept_id, section_id, creator_id) VALUES (?, "section", ?, ?, ?)', [`${deptRows[0]?.name || 'Dept'} - ${name.trim()}`, dept_id, sectionId, creator_id]);
  
  await pool.execute('INSERT IGNORE INTO channel_members (channel_id, user_id, role) VALUES (?, ?, ?)', [chanRes.insertId, creator_id, 'owner']);
  
  return { id: sectionId, name: name.trim(), dept_id };
};

const getSubjects = async (dept_id) => {
  const [rows] = await pool.execute('SELECT * FROM subjects WHERE dept_id = ? ORDER BY name ASC', [dept_id]);
  return rows;
};

const createSubject = async ({ dept_id, name }) => {
  const [result] = await pool.execute('INSERT INTO subjects (name, dept_id) VALUES (?, ?)', [name.trim(), dept_id]);
  return { id: result.insertId, name: name.trim(), dept_id };
};

const updateSubject = async (dept_id, subjectId, { name }) => {
  await pool.execute('UPDATE subjects SET name = ? WHERE id = ?', [name.trim(), subjectId]);
  return { id: subjectId, name: name.trim() };
};

const deleteSubject = async (dept_id, subjectId) => {
  await pool.execute('DELETE FROM subjects WHERE id = ?', [subjectId]);
  return { success: true };
};

const getSubjectOfferings = async (dept_id, section_id) => {
  let query = 'SELECT so.*, s.name as subject_name, u.name as faculty_name, sec.name as section_name, t.name as term_name FROM subject_offerings so JOIN subjects s ON so.subject_id = s.id LEFT JOIN users u ON so.faculty_id = u.id JOIN sections sec ON so.section_id = sec.id LEFT JOIN terms t ON so.term_id = t.id WHERE s.dept_id = ?';
  const params = [dept_id];
  if (section_id) { query += ' AND so.section_id = ?'; params.push(section_id); }
  const [rows] = await pool.execute(query, params);
  return rows;
};

const getSubjectOfferingContext = async (offeringId, dept_id) => {
  const [rows] = await pool.execute(
    `SELECT
      so.*,
      s.name AS subject_name,
      s.dept_id AS subject_dept_id,
      sec.name AS section_name,
      u.name AS faculty_name,
      t.name AS term_name
    FROM subject_offerings so
    JOIN subjects s ON s.id = so.subject_id
    JOIN sections sec ON sec.id = so.section_id
    LEFT JOIN users u ON u.id = so.faculty_id
    LEFT JOIN terms t ON t.id = so.term_id
    WHERE so.id = ? AND s.dept_id = ?`,
    [offeringId, dept_id]
  );

  if (!rows[0]) {
    throw new Error('Offering not found');
  }

  return rows[0];
};

const buildSubjectChannelName = ({ subject_name, section_name }) => `${subject_name} (${section_name})`;

const syncSubjectChannelMembers = async ({ channel_id, section_id, faculty_id }) => {
  await pool.execute('DELETE FROM channel_members WHERE channel_id = ?', [channel_id]);

  await pool.execute(
    `INSERT INTO channel_members (channel_id, user_id)
     SELECT ?, u.id
     FROM users u
     WHERE u.section_id = ? AND u.role = 'student' AND u.is_active = 1`,
    [channel_id, section_id]
  );

  if (faculty_id) {
    await pool.execute(
      `INSERT INTO channel_members (channel_id, user_id)
       SELECT ?, u.id
       FROM users u
       WHERE u.id = ? AND u.role = 'faculty'`,
      [channel_id, faculty_id]
    );
  }
};

const ensureSubjectChannelForOffering = async (offeringId, dept_id) => {
  const offering = await getSubjectOfferingContext(offeringId, dept_id);
  const channelName = buildSubjectChannelName(offering);

  const [existingRows] = await pool.execute(
    `SELECT *
     FROM channels
     WHERE subject_offering_id = ?
        OR (type = 'subject' AND dept_id = ? AND section_id = ? AND subject_offering_id IS NULL AND name = ?)
     ORDER BY id ASC
     LIMIT 1`,
    [offeringId, dept_id, offering.section_id, channelName]
  );

  let channel = existingRows[0];
  let created = false;

  if (!channel) {
    const [insertResult] = await pool.execute(
      'INSERT INTO channels (name, type, dept_id, section_id, subject_offering_id, term_id) VALUES (?, "subject", ?, ?, ?, ?)',
      [channelName, dept_id, offering.section_id, offering.id, offering.term_id || null]
    );

    const [createdRows] = await pool.execute('SELECT * FROM channels WHERE id = ?', [insertResult.insertId]);
    channel = createdRows[0];
    created = true;
  } else {
    await pool.execute(
      'UPDATE channels SET name = ?, dept_id = ?, section_id = ?, subject_offering_id = ?, term_id = ? WHERE id = ?',
      [channelName, dept_id, offering.section_id, offering.id, offering.term_id || null, channel.id]
    );
    channel = {
      ...channel,
      name: channelName,
      dept_id,
      section_id: offering.section_id,
      subject_offering_id: offering.id,
      term_id: offering.term_id || null
    };
  }

  await syncSubjectChannelMembers({
    channel_id: channel.id,
    section_id: offering.section_id,
    faculty_id: offering.faculty_id
  });

  return {
    created,
    channel,
    offering
  };
};

const createSubjectOffering = async ({ subject_id, section_id, faculty_id, term_id, dept_id }) => {
  const [result] = await pool.execute('INSERT INTO subject_offerings (subject_id, section_id, faculty_id, term_id) VALUES (?, ?, ?, ?)', [subject_id, section_id, faculty_id, term_id]);
  const ensured = await ensureSubjectChannelForOffering(result.insertId, dept_id);
  return {
    id: result.insertId,
    channel_created: ensured.created,
    channel: ensured.channel
  };
};

const deleteSubjectOffering = async (dept_id, offeringId) => {
  await pool.execute('DELETE FROM subject_offerings WHERE id = ?', [offeringId]);
  return { success: true };
};

const updateSubjectOffering = async (dept_id, offeringId, data) => {
  await getSubjectOfferingContext(offeringId, dept_id);
  await pool.execute(
    'UPDATE subject_offerings SET faculty_id = ?, section_id = ?, term_id = ? WHERE id = ?',
    [data.faculty_id, data.section_id, data.term_id, offeringId]
  );
  const ensured = await ensureSubjectChannelForOffering(offeringId, dept_id);
  return {
    id: offeringId,
    ...data,
    channel_created: ensured.created,
    channel: ensured.channel
  };
};

const getSubjectAnalytics = async (dept_id, subjectId) => {
  const [subjectRows] = await pool.execute(
    `SELECT s.*, d.name AS dept_name
     FROM subjects s
     LEFT JOIN departments d ON d.id = s.dept_id
     WHERE s.id = ? AND s.dept_id = ?`,
    [subjectId, dept_id]
  );

  if (!subjectRows[0]) {
    throw new Error('Subject not found');
  }

  const [offeringRows] = await pool.execute(
    `SELECT
      so.id,
      so.subject_id,
      so.section_id,
      so.faculty_id,
      so.term_id,
      sec.name AS section_name,
      u.name AS faculty_name,
      t.name AS term_name,
      c.id AS channel_id,
      c.name AS channel_name,
      (SELECT COUNT(*) FROM channel_members cm WHERE cm.channel_id = c.id) AS member_count
     FROM subject_offerings so
     JOIN sections sec ON sec.id = so.section_id
     LEFT JOIN users u ON u.id = so.faculty_id
     LEFT JOIN terms t ON t.id = so.term_id
     LEFT JOIN channels c ON c.subject_offering_id = so.id AND c.type = 'subject'
     WHERE so.subject_id = ?
     ORDER BY sec.name ASC, t.name ASC`,
    [subjectId]
  );

  const facultyMap = new Map();
  const sectionMap = new Map();

  offeringRows.forEach((offering) => {
    if (offering.faculty_id) {
      facultyMap.set(offering.faculty_id, {
        id: offering.faculty_id,
        name: offering.faculty_name || 'Unassigned'
      });
    }
    if (offering.section_id) {
      sectionMap.set(offering.section_id, {
        id: offering.section_id,
        name: offering.section_name
      });
    }
  });

  return {
    subject: subjectRows[0],
    summary: {
      totalOfferings: offeringRows.length,
      assignedFacultyCount: facultyMap.size,
      assignedSectionCount: sectionMap.size,
      channelCount: offeringRows.filter((offering) => offering.channel_id).length,
      missingChannelCount: offeringRows.filter((offering) => !offering.channel_id).length
    },
    assignedFaculty: Array.from(facultyMap.values()),
    assignedSections: Array.from(sectionMap.values()),
    offerings: offeringRows
  };
};

const createSubjectChannels = async (dept_id, subjectId) => {
  const [subjectRows] = await pool.execute(
    'SELECT id FROM subjects WHERE id = ? AND dept_id = ?',
    [subjectId, dept_id]
  );

  if (!subjectRows[0]) {
    throw new Error('Subject not found');
  }

  const [offeringRows] = await pool.execute(
    `SELECT so.id
     FROM subject_offerings so
     JOIN subjects s ON s.id = so.subject_id
     WHERE so.subject_id = ? AND s.dept_id = ?`,
    [subjectId, dept_id]
  );

  if (offeringRows.length === 0) {
    return {
      success: true,
      createdCount: 0,
      updatedCount: 0,
      channels: []
    };
  }

  const results = [];
  for (const offering of offeringRows) {
    results.push(await ensureSubjectChannelForOffering(offering.id, dept_id));
  }

  return {
    success: true,
    createdCount: results.filter((result) => result.created).length,
    updatedCount: results.filter((result) => !result.created).length,
    channels: results.map((result) => result.channel)
  };
};

const createAnnouncement = async ({ 
  sender_id, dept_id, content, title, sectionIds = [], visibility = 'all', type = 'normal',
  event_date = null, event_location = null, event_registration_url = null, image_url = null
}) => {
  try {
    const results = [];
    
    if (visibility === 'section' && sectionIds.length > 0) {
      for (const sectionId of sectionIds) {
        const [res] = await pool.execute(
          `INSERT INTO announcements 
           (title, content, type, visibility, target_section_id, target_dept_id, created_by, event_date, event_location, event_registration_url, image_url) 
           VALUES (?, ?, ?, "section", ?, ?, ?, ?, ?, ?, ?)`,
          [title, content, type, sectionId, dept_id, sender_id, event_date, event_location, event_registration_url, image_url]
        );
        results.push({ id: res.insertId, section_id: sectionId });
      }
    } else {
      const [res] = await pool.execute(
        `INSERT INTO announcements 
         (title, content, type, visibility, target_dept_id, created_by, event_date, event_location, event_registration_url, image_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, content, type, visibility, dept_id, sender_id, event_date, event_location, event_registration_url, image_url]
      );
      results.push({ id: res.insertId, dept_id });
    }

    return results.length === 1 ? results[0] : { success: true, count: results.length };
  } catch (err) {
    console.error('createAnnouncement error:', err.message);
    throw err;
  }
};

const updateUser = async ({ dept_id, userId, data }) => {
  const fields = []; const params = [];
  Object.keys(data).forEach(key => {
    if (['name', 'email', 'phone', 'is_active', 'verification_status', 'section_id', 'reg_no', 'enrollment_no'].includes(key)) {
      fields.push(`${key} = ?`); params.push(data[key]);
    }
  });
  if (fields.length === 0) return { message: 'No changes' };
  params.push(userId);
  await pool.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
  return { message: 'Updated' };
};

const importStudents = async ({ dept_id, students }) => {
  for (const s of students) await createStudent({ dept_id, data: s });
  return { success: true };
};

const importFaculty = async ({ dept_id, faculty }) => {
  for (const f of faculty) await createFaculty({ dept_id, data: f });
  return { success: true };
};

const ensureAdminDepartmentChannel = async (dept_id) => {
  if (!dept_id) {
    throw new Error('Department is required for admin chat');
  }

  const [deptRows] = await pool.execute('SELECT name FROM departments WHERE id = ?', [dept_id]);
  const deptName = deptRows[0]?.name || 'Department';
  const canonicalName = `${deptName} ALL`;

  const [existingRows] = await pool.execute(
    `SELECT * FROM channels
     WHERE dept_id = ? AND type = 'branch' AND section_id IS NULL AND subject_offering_id IS NULL
     ORDER BY id ASC LIMIT 1`,
    [dept_id]
  );

  let channel = existingRows[0];

  if (!channel) {
    const [insertResult] = await pool.execute(
      'INSERT INTO channels (name, type, dept_id) VALUES (?, "branch", ?)',
      [canonicalName, dept_id]
    );

    const [createdRows] = await pool.execute('SELECT * FROM channels WHERE id = ?', [insertResult.insertId]);
    channel = createdRows[0];
  } else if (channel.name !== canonicalName) {
    await pool.execute('UPDATE channels SET name = ? WHERE id = ?', [canonicalName, channel.id]);
    channel.name = canonicalName;
  }

  return channel;
};

const ensureDepartmentMembersInAdminChannel = async (channel_id, dept_id) => {
  await pool.execute(
    `INSERT INTO channel_members (channel_id, user_id)
     SELECT ?, u.id
     FROM users u
     LEFT JOIN channel_members cm ON cm.channel_id = ? AND cm.user_id = u.id
     WHERE u.dept_id = ?
       AND u.role IN ('student', 'faculty', 'dept_admin')
       AND cm.id IS NULL`,
    [channel_id, channel_id, dept_id]
  );
};

const getChatChannels = async (user_id, dept_id) => {
  try {
    const adminChannel = await ensureAdminDepartmentChannel(dept_id);
    await ensureDepartmentMembersInAdminChannel(adminChannel.id, dept_id);

    const [rows] = await pool.execute(
      `SELECT
        c.*,
        (SELECT COUNT(*) FROM channel_members cm WHERE cm.channel_id = c.id) AS member_count,
        (SELECT m.content FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message,
        (SELECT m.created_at FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message_time,
        (SELECT u.name FROM messages m LEFT JOIN users u ON u.id = m.sender_id WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_sender
      FROM channels c
      WHERE (c.dept_id = ? OR ? IS NULL) AND c.type NOT IN ('section', 'subject')
      ORDER BY FIELD(c.type, 'branch', 'announcement', 'general', 'club'), c.created_at DESC`,
      [dept_id, dept_id]
    );

    return rows || [];
  } catch (err) {
    console.error('getChatChannels error:', err.message);
    return [];
  }
};

const getChannelMessages = async (channel_id, limit = 50) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        m.*,
        u.name AS sender_name,
        u.role AS sender_role,
        (SELECT COUNT(*) FROM messages r WHERE r.parent_id = m.id) AS reply_count
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.channel_id = ? AND m.parent_id IS NULL
      ORDER BY m.created_at ASC
      LIMIT ?`,
      [channel_id, Number(limit)]
    );
    return rows || [];
  } catch (err) {
    console.error('getChannelMessages error:', err.message);
    return [];
  }
};

const getMessageReplies = async (message_id, limit = 100) => {
  try {
    const [rows] = await pool.execute(
      `SELECT
        m.*,
        u.name AS sender_name,
        u.role AS sender_role
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u.id
      WHERE m.parent_id = ?
      ORDER BY m.created_at ASC
      LIMIT ?`,
      [message_id, Number(limit)]
    );
    return rows || [];
  } catch (err) {
    console.error('getMessageReplies error:', err.message);
    return [];
  }
};

const getChatChannelDetails = async (channel_id, dept_id) => {
  const [channelRows] = await pool.execute(
    `SELECT
      c.*,
      d.name AS dept_name,
      (SELECT COUNT(*) FROM users u WHERE u.dept_id = c.dept_id AND u.role = 'student') AS student_count,
      (SELECT COUNT(*) FROM users u WHERE u.dept_id = c.dept_id AND u.role = 'faculty') AS faculty_count,
      (SELECT COUNT(*) FROM channel_members cm WHERE cm.channel_id = c.id) AS member_count
    FROM channels c
    LEFT JOIN departments d ON d.id = c.dept_id
    WHERE c.id = ? AND c.dept_id = ?`,
    [channel_id, dept_id]
  );

  if (!channelRows[0]) {
    throw new Error('Channel not found for this department');
  }

  const [faculty] = await pool.execute(
    `SELECT id, name, role
     FROM users
     WHERE dept_id = ? AND role = 'faculty'
     ORDER BY name ASC
     LIMIT 20`,
    [dept_id]
  );

  const [students] = await pool.execute(
    `SELECT id, name, role
     FROM users
     WHERE dept_id = ? AND role = 'student'
     ORDER BY name ASC
     LIMIT 40`,
    [dept_id]
  );

  return {
    ...channelRows[0],
    faculty: faculty || [],
    students: students || []
  };
};

const sendMessage = async ({ channel_id, sender_id, content, type = 'text', parent_id = null }) => {
  if (!content || !String(content).trim()) {
    throw new Error('Message content is required');
  }

  let finalChannelId = Number(channel_id) || null;
  const finalParentId = parent_id ? Number(parent_id) : null;

  if (finalParentId) {
    const [parentRows] = await pool.execute('SELECT id, channel_id FROM messages WHERE id = ?', [finalParentId]);
    if (!parentRows[0]) {
      throw new Error('Parent message not found');
    }
    finalChannelId = parentRows[0].channel_id;
  }

  if (!finalChannelId) {
    throw new Error('Channel is required');
  }

  const safeType = ['text', 'announcement', 'system', 'image', 'file'].includes(type) ? type : 'text';

  const [res] = await pool.execute(
    'INSERT INTO messages (channel_id, sender_id, content, type, parent_id) VALUES (?, ?, ?, ?, ?)',
    [finalChannelId, sender_id, String(content).trim(), safeType, finalParentId]
  );

  const [rows] = await pool.execute(
    `SELECT
      m.*,
      u.name AS sender_name,
      u.role AS sender_role,
      (SELECT COUNT(*) FROM messages r WHERE r.parent_id = m.id) AS reply_count
    FROM messages m
    LEFT JOIN users u ON m.sender_id = u.id
    WHERE m.id = ?`,
    [res.insertId]
  );

  return rows[0];
};

const getChannelMemberEligibleUsers = async (dept_id) => {
  try {
    const [sections] = await pool.execute('SELECT id, name FROM sections WHERE (dept_id = ? OR ? IS NULL) ORDER BY name ASC', [dept_id, dept_id]);
    const [faculty] = await pool.execute('SELECT id, name FROM users WHERE role = "faculty" AND (dept_id = ? OR ? IS NULL) AND is_active = 1 ORDER BY name ASC', [dept_id, dept_id]);
    const [students] = await pool.execute('SELECT id, name, section_id FROM users WHERE role = "student" AND (dept_id = ? OR ? IS NULL) AND is_active = 1 ORDER BY name ASC', [dept_id, dept_id]);
    
    return {
      sections: sections || [],
      faculty: faculty || [],
      students: students || []
    };
  } catch (err) {
    console.error('getChannelMemberEligibleUsers error:', err.message);
    throw err;
  }
};

const syncChannelMembers = async ({ channel_id, user_ids }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // 1. Clear existing members (optional, but requested for 'sync' behavior usually)
    // Actually, user said 'select who will be added', maybe just ADD them?
    // "select who will be added in the chat group" -> usually means sync.
    await connection.execute('DELETE FROM channel_members WHERE channel_id = ?', [channel_id]);
    
    // 2. Insert new members with appropriate roles
    if (user_ids && user_ids.length > 0) {
      // Get the channel's creator_id for comparison
      const [chanRows] = await connection.execute('SELECT creator_id FROM channels WHERE id = ?', [channel_id]);
      const creatorId = chanRows[0]?.creator_id;

      for (const uid of user_ids) {
        // Fetch user's system role to determine channel role
        const [uRows] = await connection.execute('SELECT role FROM users WHERE id = ?', [uid]);
        const userSystemRole = uRows[0]?.role;
        
        let channelRole = 'member';
        if (Number(uid) === Number(creatorId)) {
          channelRole = 'owner';
        } else if (userSystemRole === 'faculty' || userSystemRole.includes('admin')) {
          channelRole = 'admin';
        }

        await connection.execute(
          'INSERT IGNORE INTO channel_members (channel_id, user_id, role) VALUES (?, ?, ?)',
          [channel_id, uid, channelRole]
        );
      }
    }
    
    await connection.commit();
    return { success: true, count: user_ids.length };
  } catch (err) {
    await connection.rollback();
    console.error('syncChannelMembers error:', err.message);
    throw err;
  } finally {
    connection.release();
  }
};

module.exports = {
  getDashboardStats, 
  getRecentAnnouncements, 
  getUserActivity, 
  getChannels, 
  createChannel, 
  getClubs, 
  createClub, 
  updateClub, 
  deleteClub, 
  deleteChannel, 
  getReports, 
  resolveReport, 
  getStudents, 
  getFaculty, 
  createStudent, 
  createFaculty, 
  getDepartments, 
  createDepartment, 
  getSections, 
  createSection, 
  getSubjects, 
  createSubject, 
  updateSubject, 
  deleteSubject, 
  getSubjectAnalytics,
  createSubjectChannels,
  getSubjectOfferings, 
  createSubjectOffering, 
  deleteSubjectOffering, 
  updateSubjectOffering, 
  createAnnouncement, 
  updateUser, 
  updateStudent: updateUser, 
  updateFaculty: updateUser, 
  importStudents, 
  importFaculty, 
  getChatChannels, 
  getChannelMessages, 
  getMessageReplies, 
  getChatChannelDetails, 
  sendMessage,
  getChannelMemberEligibleUsers,
  syncChannelMembers
};
