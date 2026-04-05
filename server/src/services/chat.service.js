const pool = require('../config/db');

const annotateStudentChannel = (channel) => {
  const isDepartmentBroadcast =
    channel?.type === 'branch' &&
    channel?.section_id == null &&
    channel?.subject_offering_id == null;

  return {
    ...channel,
    is_department_broadcast: isDepartmentBroadcast,
    can_student_post_top_level: !isDepartmentBroadcast,
    can_student_reply_in_threads: true,
    student_posting_mode: isDepartmentBroadcast ? 'thread_only' : 'open'
  };
};

const getStudentChannels = async (user_id, dept_id, section_id) => {
  try {
    // 1. Fetch Branch Channels (Dept ALL)
    // 2. Fetch Section Channels (Matching student's section)
    // 3. Fetch Subject Channels (Matching student's section - for now assume subjects are linked via section_id)
    
    const [rows] = await pool.execute(
      `SELECT 
        c.*,
        (CASE 
          WHEN c.visibility = 'all' THEN (SELECT COUNT(*) FROM users WHERE is_active = 1)
          WHEN (c.visibility = 'department' AND c.section_id IS NULL AND c.subject_offering_id IS NULL) 
            THEN (SELECT COUNT(*) FROM users WHERE dept_id = c.dept_id AND is_active = 1)
          ELSE (SELECT COUNT(*) FROM channel_members WHERE channel_id = c.id)
        END) AS member_count,
        (SELECT m.content FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message,
        (SELECT m.created_at FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message_time,
        (SELECT u.name FROM messages m LEFT JOIN users u ON u.id = m.sender_id WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_sender
      FROM channels c
      WHERE c.dept_id = ? 
        AND (c.section_id IS NULL OR c.section_id = ?)
      ORDER BY FIELD(c.type, 'branch', 'section', 'subject'), c.created_at DESC`,
      [dept_id, section_id]
    );

    return (rows || []).map(annotateStudentChannel);
  } catch (err) {
    console.error('getStudentChannels error:', err.message);
    return [];
  }
};

const getFacultyChannels = async (faculty_id, dept_id) => {
  try {
    const [rows] = await pool.execute(
       `SELECT 
        c.*,
        (CASE 
          WHEN c.visibility = 'all' THEN (SELECT COUNT(*) FROM users WHERE is_active = 1)
          WHEN (c.visibility = 'department' AND c.section_id IS NULL AND c.subject_offering_id IS NULL) 
            THEN (SELECT COUNT(*) FROM users WHERE dept_id = c.dept_id AND is_active = 1)
          ELSE (SELECT COUNT(*) FROM channel_members WHERE channel_id = c.id)
        END) AS member_count,
        (SELECT m.content FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message,
        (SELECT m.created_at FROM messages m WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_message_time,
        (SELECT u.name FROM messages m LEFT JOIN users u ON u.id = m.sender_id WHERE m.channel_id = c.id AND m.parent_id IS NULL ORDER BY m.created_at DESC LIMIT 1) AS last_sender,
        (SELECT COUNT(*) FROM messages m WHERE m.channel_id = c.id AND m.created_at > COALESCE((SELECT m2.created_at FROM messages m2 WHERE m2.id = (SELECT cm.last_read_message_id FROM channel_members cm WHERE cm.channel_id = c.id AND cm.user_id = ?)), '1970-01-01')) AS unread_count
      FROM channels c
      LEFT JOIN subject_offerings so ON so.id = c.subject_offering_id
      LEFT JOIN channel_members cm_check ON cm_check.channel_id = c.id AND cm_check.user_id = ?
      WHERE (c.dept_id = ? AND c.type IN ('branch', 'general')) -- Department Broadcasts
         OR (so.faculty_id = ?) -- The assigned faculty for this specific subject/section
         OR (cm_check.id IS NOT NULL) -- Explicit membership (Coordinator, etc.)
      GROUP BY c.id
      ORDER BY FIELD(c.type, 'branch', 'section', 'subject'), last_message_time DESC, c.created_at DESC`,
      [faculty_id, dept_id, faculty_id, faculty_id]
    );

    return (rows || []).map(annotateStudentChannel);
  } catch (err) {
    console.error('getFacultyChannels error:', err.message);
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
      WHERE m.channel_id = ? AND m.parent_id IS NULL AND m.is_deleted = 0
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
      WHERE m.parent_id = ? AND m.is_deleted = 0
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

const markChannelAsRead = async (channel_id, user_id) => {
  try {
    // 1. Get the latest message ID in the channel
    const [msgRows] = await pool.execute(
      'SELECT MAX(id) as last_id FROM messages WHERE channel_id = ? AND parent_id IS NULL',
      [channel_id]
    );
    const last_id = msgRows[0]?.last_id;
    if (!last_id) return true;

    // 2. Update or insert the read status
    await pool.execute(
      `INSERT INTO channel_members (channel_id, user_id, last_read_message_id) 
       VALUES (?, ?, ?) 
       ON DUPLICATE KEY UPDATE last_read_message_id = ?`,
      [channel_id, user_id, last_id, last_id]
    );
    return true;
  } catch (err) {
    console.error('markChannelAsRead error:', err.message);
    return false;
  }
};

const getChannelPostingPolicy = async (channel_id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, type, section_id, subject_offering_id
     FROM channels
     WHERE id = ?`,
    [channel_id]
  );

  if (rows.length === 0) return null;

  return annotateStudentChannel(rows[0]);
};

const getMessageById = async (message_id) => {
  const [rows] = await pool.execute(
    `SELECT id, channel_id, parent_id, type
     FROM messages
     WHERE id = ?`,
    [message_id]
  );

  return rows[0] || null;
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
    
    // Get members (presence-aware)
    // If it's a global-visibility channel with no section-specific restriction, include all departmental members by default
    const [members] = await pool.execute(
      `SELECT 
        u.id, u.name, u.role, u.dept_id, d.name as dept_name,
        u.is_online, u.last_seen, 
        COALESCE(cm.role, CASE WHEN u.role = 'student' THEN 'member' ELSE 'admin' END) as channel_role
       FROM users u
       LEFT JOIN channel_members cm ON cm.user_id = u.id AND cm.channel_id = ?
       LEFT JOIN departments d ON d.id = u.dept_id
       WHERE (cm.channel_id = ?) 
          OR ( 
               (? = 'all') 
               AND ? IS NULL AND ? IS NULL
               AND u.is_active = 1
             )
          OR (
               (? = 'department')
               AND ? IS NULL AND ? IS NULL
               AND u.dept_id = ?
               AND u.is_active = 1
             )`,
      [
        channel_id, channel_id, 
        channel.visibility, channel.section_id, channel.subject_offering_id,
        channel.visibility, channel.section_id, channel.subject_offering_id, channel.dept_id
      ]
    );

    return annotateStudentChannel({
      ...channel,
      members: members.map(m => ({ ...m, is_online: !!m.is_online })) || []
    });
  } catch (err) {
    console.error('getChannelDetails error:', err.message);
    throw err;
  }
};

const editMessage = async (message_id, user_id, new_content) => {
  try {
    const result = await pool.execute(
      'UPDATE messages SET content = ?, is_edited = 1 WHERE id = ? AND sender_id = ?',
      [new_content, message_id, user_id]
    );
    return result[0].affectedRows > 0;
  } catch (err) {
    console.error('editMessage error:', err.message);
    return false;
  }
};

const deleteMessage = async (message_id, user_id) => {
  try {
    const result = await pool.execute(
      'UPDATE messages SET is_deleted = 1 WHERE id = ? AND sender_id = ?',
      [message_id, user_id]
    );
    return result[0].affectedRows > 0;
  } catch (err) {
    console.error('deleteMessage error:', err.message);
    return false;
  }
};

module.exports = {
  getStudentChannels,
  getChannelMessages,
  getMessageReplies,
  getChannelDetails,
  sendMessage,
  editMessage,
  deleteMessage,
  getChannelPostingPolicy,
  getMessageById,
  getFacultyChannels,
  markChannelAsRead
};
