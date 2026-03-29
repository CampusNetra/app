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

module.exports = {
  getFeed,
  getAnnouncements
};
