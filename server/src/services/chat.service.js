const pool = require('../config/db');

const getStudentChannels = async (user_id, dept_id, section_id) => {
  try {
    // 1. Fetch Branch Channels (Dept ALL)
    // 2. Fetch Section Channels (Matching student's section)
    // 3. Fetch Subject Channels (Matching student's section - for now assume subjects are linked via section_id)
    
    const [rows] = await pool.execute(
      `SELECT 
        c.*,
        (SELECT COUNT(*) FROM channel_members cm WHERE cm.channel_id = c.id) AS member_count,
        (SELECT m.content FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message,
        (SELECT m.created_at FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message_time,
        (SELECT u.name FROM messages m LEFT JOIN users u ON u.id = m.sender_id WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_sender
      FROM channels c
      WHERE (c.dept_id = ? AND c.type = 'branch' AND c.section_id IS NULL)
         OR (c.section_id = ? AND c.type = 'section')
         OR (c.section_id = ? AND c.type = 'subject')
      ORDER BY FIELD(c.type, 'branch', 'section', 'subject'), c.created_at DESC`,
      [dept_id, section_id, section_id]
    );

    return rows || [];
  } catch (err) {
    console.error('getStudentChannels error:', err.message);
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

const sendMessage = async ({ channel_id, sender_id, content, type = 'text', parent_id = null }) => {
  try {
    const [res] = await pool.execute(
      'INSERT INTO messages (channel_id, sender_id, content, type, parent_id) VALUES (?, ?, ?, ?, ?)',
      [channel_id, sender_id, content, type, parent_id]
    );

    const [rows] = await pool.execute(
      `SELECT m.*, u.name AS sender_name, u.role AS sender_role 
       FROM messages m 
       LEFT JOIN users u ON m.sender_id = u.id 
       WHERE m.id = ?`,
      [res.insertId]
    );

    return rows[0];
  } catch (err) {
    console.error('sendMessage error:', err.message);
    throw err;
  }
};

const getChannelDetails = async (channel_id) => {
  try {
    const [rows] = await pool.execute(
      `SELECT c.*, 
        d.name as department_name, 
        s.name as section_name
       FROM channels c
       LEFT JOIN departments d ON d.id = c.dept_id
       LEFT JOIN sections s ON s.id = c.section_id
       WHERE c.id = ?`,
      [channel_id]
    );
    
    if (rows.length === 0) return null;
    
    const channel = rows[0];
    
    // Get members (faculty vs students)
    const [members] = await pool.execute(
      `SELECT u.id, u.name, u.role, u.department_id, d.name as dept_name
       FROM channel_members cm
       JOIN users u ON cm.user_id = u.id
       LEFT JOIN departments d ON d.id = u.dept_id
       WHERE cm.channel_id = ?`,
      [channel_id]
    );

    return {
      ...channel,
      members: members || []
    };
  } catch (err) {
    console.error('getChannelDetails error:', err.message);
    throw err;
  }
};

module.exports = {
  getStudentChannels,
  getChannelMessages,
  getMessageReplies,
  sendMessage,
  getChannelDetails
};
