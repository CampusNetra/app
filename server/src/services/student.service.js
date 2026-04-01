const pool = require('../config/db');

const getAnnouncements = async ({ dept_id, section_id, limit = 50 }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  try {
    const [rows] = await pool.execute(
       `SELECT
        id,
        title,
        content,
        type as announcementType,
        visibility,
        created_at,
        created_by,
        event_date,
        event_location,
        event_registration_url,
        image_url
      FROM announcements
      WHERE
        is_active = 1
        AND (
          visibility = 'all'
          OR (visibility = 'section' AND target_section_id = ?)
          OR (visibility = 'department' AND target_dept_id = ?)
        )
      ORDER BY created_at DESC
      LIMIT ?`,
      [section_id || null, dept_id || null, safeLimit]
    );

    const announcements = (rows || []).map((row) => ({
      ...row,
      type: row.announcementType === 'important' ? 'important' : 'regular',
      announcementType: row.announcementType || 'normal',
      title: row.title || 'Campus Announcement',
      source: 'Campus Netra',
      category: 'announcement',
      channelType: 'announcement',
      createdAt: row.created_at,
      isAnnouncement: true
    }));

    return announcements;
  } catch (error) {
    console.error('[StudentService] Error fetching announcements:', error);
    return [];
  }
};

const getFeed = async ({ dept_id, section_id, limit = 50 }) => {
  try {
    const announcements = await getAnnouncements({ dept_id, section_id, limit });
    return { posts: announcements };
  } catch (error) {
    console.error('[StudentService] Error fetching feed:', error);
    return { posts: [] };
  }
};

const getProfile = async (user_id) => {
  try {
    // 1. Fetch Basic Profile Info
    const [userRows] = await pool.execute(`
      SELECT 
        u.id, u.name, u.reg_no, u.role, u.avatar_url,
        d.name as dept_name, 
        s.name as section_name
      FROM users u
      LEFT JOIN departments d ON d.id = u.dept_id
      LEFT JOIN sections s ON s.id = u.section_id
      WHERE u.id = ?
    `, [user_id]);
    
    if (!userRows[0]) throw new Error('User not found');

    // 2. Fetch Clubs (Channels which are type club)
    const [clubs] = await pool.execute(`
      SELECT 
        c.id, c.name, cl.category as category,
        COALESCE(cm.role, 'Member') as role
      FROM channels c
      JOIN channel_members cm ON c.id = cm.channel_id
      LEFT JOIN clubs cl ON cl.channel_id = c.id
      WHERE cm.user_id = ? AND c.type = 'club'
    `, [user_id]);

    // 3. Fetch ALL Joined Groups (excluding clubs)
    const [joinedGroups] = await pool.execute(`
      SELECT 
        c.id, c.name, c.type,
        COALESCE(cm.role, 'Member') as role
      FROM channels c
      JOIN channel_members cm ON c.id = cm.channel_id
      WHERE cm.user_id = ? AND c.type != 'club'
      ORDER BY c.name ASC
    `, [user_id]);
    
    return {
      ...userRows[0],
      clubs: clubs || [],
      joinedGroups: joinedGroups || []
    };
  } catch (err) {
    console.error('[StudentService] Error fetching profile:', err.message);
    throw err;
  }
};

module.exports = {
  getFeed,
  getAnnouncements,
  getProfile
};
