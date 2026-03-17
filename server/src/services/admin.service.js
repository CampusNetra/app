const pool = require('../config/db');

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
    'SELECT COUNT(*) as count FROM messages WHERE DATE(created_at) = CURDATE()'
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
  createAnnouncement
};
