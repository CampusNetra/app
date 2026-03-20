const pool = require('../config/db');
const bcrypt = require('bcryptjs');

const getDashboardStats = async (dept_id) => {
  // 1. Total Students
  const [students] = await pool.execute(
    'SELECT COUNT(*) as count FROM users WHERE role = "student" AND dept_id = ?',
    [dept_id]
  );

  // 2. Total Faculty
  const [faculty] = await pool.execute(
    'SELECT COUNT(*) as count FROM users WHERE role = "faculty" AND dept_id = ?',
    [dept_id]
  );

  // 3. Active Sections
  const [sections] = await pool.execute(
    'SELECT COUNT(*) as count FROM sections WHERE dept_id = ?',
    [dept_id]
  );

  // 4. Total Channels (Branch + Sections + Subjects)
  const [channels] = await pool.execute(
    'SELECT COUNT(*) as count FROM channels WHERE dept_id = ?',
    [dept_id]
  );

  // 5. Messages Today
  const [messages] = await pool.execute(
    'SELECT COUNT(*) as count FROM messages WHERE date(created_at) = date("now")'
  );

  return {
    totalStudents: students[0].count,
    totalFaculty: faculty[0].count,
    activeSections: sections[0].count,
    totalChannels: channels[0].count,
    messagesToday: messages[0].count
  };
};

const getRecentAnnouncements = async (dept_id) => {
  // Fetch recent announcements for this department
  const [rows] = await pool.execute(
    `SELECT m.id, m.content as title, m.created_at, c.name as channel_name, 
     (SELECT COUNT(*) FROM channel_members cm WHERE cm.channel_id = c.id) as reach
     FROM messages m
     JOIN channels c ON m.channel_id = c.id
     WHERE m.type = "announcement" AND c.dept_id = ?
     ORDER BY m.created_at DESC LIMIT 5`,
    [dept_id]
  );
  return rows;
};

const getUserActivity = async (dept_id) => {
  // Detailed activity feed: User signups with roles/depts and Channel activity
  const [users] = await pool.execute(
    `SELECT name as detail, created_at, 'joined' as action, 'user' as type, role
     FROM users WHERE dept_id = ? 
     ORDER BY created_at DESC LIMIT 5`,
    [dept_id]
  );

  const [announcements] = await pool.execute(
    `SELECT m.content as detail, m.created_at, 'posted' as action, 'announcement' as type, c.name as channel_name
     FROM messages m
     JOIN channels c ON m.channel_id = c.id
     WHERE c.dept_id = ? AND m.type = "announcement"
     ORDER BY m.created_at DESC LIMIT 3`,
    [dept_id]
  );

  return [...users, ...announcements].sort((a,b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 6);
};

const getChannels = async (dept_id) => {
  const [rows] = await pool.execute(
    'SELECT id, name, type FROM channels WHERE dept_id = ?',
    [dept_id]
  );
  return rows;
};

const getStudents = async ({
  dept_id,
  search = '',
  section_id,
  verification_status,
  is_active,
  page = 1,
  limit = 20
}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const offset = (safePage - 1) * safeLimit;

  const whereClauses = ['u.role = ?', 'u.dept_id = ?'];
  const params = ['student', dept_id];

  if (search && search.trim()) {
    const like = `%${search.trim()}%`;
    whereClauses.push('(u.name LIKE ? OR u.email LIKE ? OR u.reg_no LIKE ? OR u.enrollment_no LIKE ?)');
    params.push(like, like, like, like);
  }

  if (section_id) {
    whereClauses.push('u.section_id = ?');
    params.push(section_id);
  }

  if (verification_status) {
    whereClauses.push('u.verification_status = ?');
    params.push(verification_status);
  }

  if (is_active !== undefined && is_active !== null && is_active !== '') {
    whereClauses.push('u.is_active = ?');
    params.push(Number(is_active) ? 1 : 0);
  }

  const whereSql = whereClauses.join(' AND ');

  const [students] = await pool.execute(
    `SELECT
      u.id,
      u.name,
      u.email,
      u.reg_no,
      u.enrollment_no,
      u.verification_status,
      u.is_active,
      u.created_at,
      s.id AS section_id,
      s.name AS section_name,
      d.name AS dept_name
    FROM users u
    LEFT JOIN sections s ON s.id = u.section_id
    LEFT JOIN departments d ON d.id = u.dept_id
    WHERE ${whereSql}
    ORDER BY u.created_at DESC
    LIMIT ? OFFSET ?`,
    [...params, safeLimit, offset]
  );

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
    FROM users u
    WHERE ${whereSql}`,
    params
  );

  const [sections] = await pool.execute(
    'SELECT id, name FROM sections WHERE dept_id = ? ORDER BY name ASC',
    [dept_id]
  );

  const total = Number(countRows[0]?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    students,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages
    },
    filters: {
      sections
    }
  };
};

const getFaculty = async ({
  dept_id,
  search = '',
  is_active,
  page = 1,
  limit = 20
}) => {
  const safePage = Math.max(1, Number(page) || 1);
  const safeLimit = Math.min(100, Math.max(1, Number(limit) || 20));
  const offset = (safePage - 1) * safeLimit;

  const whereClauses = ['u.role = ?', 'u.dept_id = ?'];
  const params = ['faculty', dept_id];

  if (search && search.trim()) {
    const like = `%${search.trim()}%`;
    whereClauses.push('(u.name LIKE ? OR u.email LIKE ? OR u.reg_no LIKE ? OR u.enrollment_no LIKE ?)');
    params.push(like, like, like, like);
  }

  if (is_active !== undefined && is_active !== null && is_active !== '') {
    whereClauses.push('u.is_active = ?');
    params.push(Number(is_active) ? 1 : 0);
  }

  const whereSql = whereClauses.join(' AND ');

  const [facultyRows] = await pool.execute(
    `SELECT
      u.id,
      u.name,
      u.email,
      u.phone,
      u.office_location,
      u.employment_type,
      u.avatar_url,
      u.reg_no,
      u.enrollment_no,
      u.role,
      u.verification_status,
      u.is_active,
      u.created_at,
      d.name AS dept_name,
      (
        SELECT GROUP_CONCAT(DISTINCT s.name)
        FROM subject_offerings so
        JOIN subjects s ON s.id = so.subject_id
        WHERE so.faculty_id = u.id
      ) AS subjects_csv
    FROM users u
    LEFT JOIN departments d ON d.id = u.dept_id
    WHERE ${whereSql}
    ORDER BY u.created_at DESC
    LIMIT ? OFFSET ?`,
    [...params, safeLimit, offset]
  );

  const faculty = await Promise.all(facultyRows.map(async (row) => {
    // Fetch Assigned Sections
    const [sections] = await pool.execute(
      'SELECT DISTINCT s.name FROM sections s JOIN subject_offerings so ON so.section_id = s.id WHERE so.faculty_id = ?',
      [row.id]
    );

    // Mock/Fetch Recent Activity
    const [messages] = await pool.execute(
      `SELECT m.content as t, m.created_at as d, 'announcement' as type 
       FROM messages m 
       WHERE m.sender_id = ? AND m.type = "announcement" 
       ORDER BY m.created_at DESC LIMIT 3`,
      [row.id]
    );

    const activity = messages.length > 0 ? messages.map(m => ({
       t: m.t,
       d: new Date(m.d).toLocaleString(),
       c: 'bg-blue-400'
    })) : [
      { t: 'Faculty profile created', d: new Date(row.created_at).toLocaleString(), c: 'bg-green-400' },
      { t: 'Access granted by Admin', d: 'May 12, 2024', c: 'bg-slate-400' }
    ];

    return {
      ...row,
      subjects: row.subjects_csv ? row.subjects_csv.split(',') : [],
      assignedSections: sections.map(s => s.name),
      recentActivity: activity
    };
  }));

  const [countRows] = await pool.execute(
    `SELECT COUNT(*) AS total
     FROM users u
     WHERE ${whereSql}`,
    params
  );

  const total = Number(countRows[0]?.total || 0);
  const totalPages = Math.max(1, Math.ceil(total / safeLimit));

  return {
    faculty,
    pagination: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages
    }
  };
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

  if (!name) {
    throw new Error('Name is required');
  }

  if (email) {
    const [existingEmail] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      throw new Error('Email already exists');
    }
  }

  if (regNo) {
    const [existingReg] = await pool.execute('SELECT id FROM users WHERE reg_no = ?', [regNo]);
    if (existingReg.length > 0) {
      throw new Error('Registration number already exists');
    }
  }

  if (enrollmentNo) {
    const [existingEnrollment] = await pool.execute('SELECT id FROM users WHERE enrollment_no = ?', [enrollmentNo]);
    if (existingEnrollment.length > 0) {
      throw new Error('Enrollment number already exists');
    }
  }

  if (role === 'student' && sectionId) {
    const [sections] = await pool.execute(
      'SELECT id FROM sections WHERE id = ? AND dept_id = ?',
      [sectionId, dept_id]
    );
    if (sections.length === 0) {
      throw new Error('Invalid section for this department');
    }
  }

  const actualPassword = String(password || regNo || enrollmentNo || '123456');
  const hashedPassword = await bcrypt.hash(actualPassword, 10);

  const [result] = await pool.execute(
    `INSERT INTO users (
      name,
      email,
      reg_no,
      enrollment_no,
      role,
      dept_id,
      section_id,
      password,
      verification_status,
      is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      email,
      regNo,
      enrollmentNo,
      role,
      dept_id,
      role === 'student' ? sectionId : null,
      hashedPassword,
      verificationStatus,
      isActive
    ]
  );

  const [rows] = await pool.execute(
    `SELECT
      u.id,
      u.name,
      u.email,
      u.reg_no,
      u.enrollment_no,
      u.role,
      u.verification_status,
      u.is_active,
      u.created_at,
      d.name AS dept_name,
      s.name AS section_name
    FROM users u
    LEFT JOIN departments d ON d.id = u.dept_id
    LEFT JOIN sections s ON s.id = u.section_id
    WHERE u.id = ?`,
    [result.insertId]
  );

  return rows[0];
};

const createStudent = async ({ dept_id, data }) => {
  return createUserByRole({ dept_id, role: 'student', data });
};

const createFaculty = async ({ dept_id, data }) => {
  return createUserByRole({ dept_id, role: 'faculty', data });
};

const getDepartments = async () => {
  const [rows] = await pool.execute('SELECT * FROM departments ORDER BY name ASC');
  return rows;
};

const createDepartment = async (name) => {
  if (!name || !name.trim()) throw new Error('Department name is required');
  const [result] = await pool.execute('INSERT INTO departments (name) VALUES (?)', [name.trim()]);
  
  // Auto-create a branch channel for the department
  await pool.execute(
    'INSERT INTO channels (name, type, dept_id) VALUES (?, "branch", ?)',
    [`${name.trim()} - All`, result.insertId]
  );

  return { id: result.insertId, name: name.trim() };
};

const getSections = async (dept_id) => {
  const [rows] = await pool.execute(
    'SELECT s.*, d.name as dept_name FROM sections s JOIN departments d ON s.dept_id = d.id WHERE s.dept_id = ? ORDER BY s.name ASC',
    [dept_id]
  );
  return rows;
};

const createSection = async ({ dept_id, name }) => {
  if (!name || !name.trim()) throw new Error('Section name is required');
  
  const [result] = await pool.execute(
    'INSERT INTO sections (name, dept_id) VALUES (?, ?)',
    [name.trim(), dept_id]
  );
  
  const sectionId = result.insertId;

  // Auto-create a section channel
  const [deptRows] = await pool.execute('SELECT name FROM departments WHERE id = ?', [dept_id]);
  const deptName = deptRows[0]?.name || 'Dept';
  
  await pool.execute(
    'INSERT INTO channels (name, type, dept_id, section_id) VALUES (?, "section", ?, ?)',
    [`${deptName} - ${name.trim()}`, dept_id, sectionId]
  );

  return { id: sectionId, name: name.trim(), dept_id };
};

const getSubjects = async (dept_id) => {
  const [rows] = await pool.execute(
    'SELECT * FROM subjects WHERE dept_id = ? ORDER BY name ASC',
    [dept_id]
  );
  return rows;
};

const createSubject = async ({ dept_id, name }) => {
  if (!name || !name.trim()) throw new Error('Subject name is required');
  const [result] = await pool.execute(
    'INSERT INTO subjects (name, dept_id) VALUES (?, ?)',
    [name.trim(), dept_id]
  );
  return { id: result.insertId, name: name.trim(), dept_id };
};

const getSubjectOfferings = async (dept_id, section_id) => {
  let query = `
    SELECT 
      so.*, 
      s.name as subject_name, 
      u.name as faculty_name, 
      u.avatar_url as faculty_avatar,
      sec.name as section_name,
      t.name as term_name
    FROM subject_offerings so
    JOIN subjects s ON so.subject_id = s.id
    LEFT JOIN users u ON so.faculty_id = u.id
    JOIN sections sec ON so.section_id = sec.id
    LEFT JOIN terms t ON so.term_id = t.id
    WHERE s.dept_id = ?
  `;
  const params = [dept_id];
  
  if (section_id) {
    query += ' AND so.section_id = ?';
    params.push(section_id);
  }
  
  const [rows] = await pool.execute(query, params);
  
  // Format for the frontend
  return rows.map(r => ({
    id: r.id,
    subject_id: r.subject_id,
    section_id: r.section_id,
    faculty_id: r.faculty_id,
    term_id: r.term_id,
    subject_name: r.subject_name,
    section_name: r.section_name,
    faculty_name: r.faculty_name,
    faculty: {
      name: r.faculty_name,
      avatar: r.faculty_avatar
    },
    term_name: r.term_name,
    created_at: r.created_at
  }));
};

const createSubjectOffering = async ({ subject_id, section_id, faculty_id, term_id, dept_id }) => {
  // 1. Create or Update Subject Offering
  const [existing] = await pool.execute(
    'SELECT id FROM subject_offerings WHERE subject_id = ? AND section_id = ? AND term_id = ?',
    [subject_id, section_id, term_id]
  );

  let offeringId;
  if (existing.length > 0) {
    offeringId = existing[0].id;
    await pool.execute(
      'UPDATE subject_offerings SET faculty_id = ? WHERE id = ?',
      [faculty_id, offeringId]
    );
  } else {
    const [result] = await pool.execute(
      'INSERT INTO subject_offerings (subject_id, section_id, faculty_id, term_id) VALUES (?, ?, ?, ?)',
      [subject_id, section_id, faculty_id, term_id]
    );
    offeringId = result.insertId;
  }

  // 2. Ensure Subject Channel
  const [subjectRows] = await pool.execute('SELECT name FROM subjects WHERE id = ?', [subject_id]);
  const [sectionRows] = await pool.execute('SELECT name FROM sections WHERE id = ?', [section_id]);
  const channelName = `${subjectRows[0].name} (${sectionRows[0].name})`;

  const [existingChannel] = await pool.execute(
    'SELECT id FROM channels WHERE type = "subject" AND subject_offering_id = ?',
    [offeringId]
  );

  let channelId;
  if (existingChannel.length > 0) {
    channelId = existingChannel[0].id;
  } else {
    const [chanResult] = await pool.execute(
      'INSERT INTO channels (name, type, dept_id, section_id, subject_offering_id, term_id) VALUES (?, "subject", ?, ?, ?, ?)',
      [channelName, dept_id, section_id, offeringId, term_id]
    );
    channelId = chanResult.insertId;
  }

  // 3. Auto-link Members
  // Add Faculty
  if (faculty_id) {
    await pool.execute(
      'INSERT IGNORE INTO channel_members (channel_id, user_id) VALUES (?, ?)',
      [channelId, faculty_id]
    );
  }

  // Add Students of the section
  const [students] = await pool.execute(
    'SELECT id FROM users WHERE role = "student" AND section_id = ?',
    [section_id]
  );

  for (const student of students) {
    await pool.execute(
      'INSERT IGNORE INTO channel_members (channel_id, user_id) VALUES (?, ?)',
      [channelId, student.id]
    );
  }

  return { id: offeringId, channel_id: channelId };
};

const createAnnouncement = async ({ sender_id, dept_id, channel_id, content }) => {
  // Verify channel belongs to department
  const [channels] = await pool.execute(
    'SELECT id FROM channels WHERE id = ? AND dept_id = ?',
    [channel_id, dept_id]
  );
  
  if (channels.length === 0) {
    throw new Error('Invalid channel for this department');
  }

  const [result] = await pool.execute(
    'INSERT INTO messages (channel_id, sender_id, content, type) VALUES (?, ?, ?, "announcement")',
    [channel_id, sender_id, content]
  );
  
  return { id: result.insertId, channel_id, sender_id, content, type: 'announcement' };
};

const updateUser = async ({ dept_id, userId, data }) => {
  const name = data?.name?.trim();
  const email = data?.email?.trim()?.toLowerCase();
  const phone = data?.phone?.trim();
  const officeLocation = data?.office_location?.trim();
  const employmentType = data?.employment_type?.trim();
  const avatarUrl = data?.avatar_url?.trim();
  const regNo = data?.reg_no?.trim();
  const enrollmentNo = data?.enrollment_no?.trim();
  const verificationStatus = data?.verification_status;
  const isActive = data?.is_active === undefined ? undefined : Number(data.is_active);
  const sectionId = data?.section_id !== undefined ? Number(data.section_id) : undefined;

  // Check if user exists and belongs to dept
  const [userRows] = await pool.execute('SELECT id, role FROM users WHERE id = ? AND dept_id = ?', [userId, dept_id]);
  if (userRows.length === 0) throw new Error('User not found in this department');

  const updateFields = [];
  const params = [];

  if (name) {
    updateFields.push('name = ?');
    params.push(name);
  }
  if (email !== undefined) {
    updateFields.push('email = ?');
    params.push(email || null);
  }
  if (phone !== undefined) {
    updateFields.push('phone = ?');
    params.push(phone || null);
  }
  if (officeLocation !== undefined) {
    updateFields.push('office_location = ?');
    params.push(officeLocation || null);
  }
  if (employmentType !== undefined) {
    updateFields.push('employment_type = ?');
    params.push(employmentType || 'Full Time');
  }
  if (avatarUrl !== undefined) {
    updateFields.push('avatar_url = ?');
    params.push(avatarUrl || null);
  }
  if (regNo !== undefined) {
    updateFields.push('reg_no = ?');
    params.push(regNo || null);
  }
  if (enrollmentNo !== undefined) {
    updateFields.push('enrollment_no = ?');
    params.push(enrollmentNo || null);
  }
  if (verificationStatus) {
    updateFields.push('verification_status = ?');
    params.push(verificationStatus);
  }
  if (isActive !== undefined) {
    updateFields.push('is_active = ?');
    params.push(isActive);
  }
  if (userRows[0].role === 'student' && sectionId !== undefined) {
    updateFields.push('section_id = ?');
    params.push(sectionId || null);
  }

  if (updateFields.length === 0) return { message: 'No changes' };

  params.push(userId);
  await pool.execute(`UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`, params);

  return { message: 'User updated successfully' };
};

module.exports = {
  getDashboardStats,
  getRecentAnnouncements,
  getUserActivity,
  getChannels,
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
  getSubjectOfferings,
  createSubjectOffering,
  createAnnouncement,
  updateUser,
  updateStudent: updateUser,
  updateFaculty: updateUser,
};
