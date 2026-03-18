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

  const faculty = facultyRows.map((row) => ({
    ...row,
    subjects: row.subjects_csv
      ? row.subjects_csv.split(',').map((item) => item.trim()).filter(Boolean)
      : []
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
  const name = data?.name?.trim();
  const email = data?.email?.trim()?.toLowerCase();
  const password = data?.password;
  const regNo = data?.reg_no?.trim() || null;
  const enrollmentNo = data?.enrollment_no?.trim() || null;
  const verificationStatus = data?.verification_status === 'verified' ? 'verified' : 'pending';
  const isActive = Number(data?.is_active) === 0 ? 0 : 1;
  const sectionId = data?.section_id ? Number(data.section_id) : null;

  if (!name || !email || !password) {
    throw new Error('name, email, and password are required');
  }

  const [existingEmail] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
  if (existingEmail.length > 0) {
    throw new Error('Email already exists');
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

  const hashedPassword = await bcrypt.hash(password, 10);

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

module.exports = {
  getDashboardStats,
  getRecentAnnouncements,
  getUserActivity,
  getChannels,
  getStudents,
  getFaculty,
  createStudent,
  createFaculty,
  createAnnouncement
};
