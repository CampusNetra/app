const pool = require('../config/db');
const pollService = require('./poll.service');

const getAnnouncements = async ({ dept_id, section_id, limit = 50 }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  try {
    const [rows] = await pool.execute(
      `SELECT
        a.id,
        a.title,
        a.content,
        a.type as announcementType,
        a.visibility,
        a.created_at,
        a.created_by,
        a.event_date,
        a.event_location,
        a.event_registration_url,
        a.image_url,
        u.name as creator_name,
        (
          SELECT GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ')
          FROM sections s
          WHERE s.id = a.target_section_id
             OR s.id IN (
               SELECT at2.target_section_id
               FROM announcement_targets at2
               WHERE at2.announcement_id = a.id AND at2.target_section_id IS NOT NULL
             )
        ) as target_sections,
        (
          SELECT GROUP_CONCAT(DISTINCT d2.name SEPARATOR ', ')
          FROM departments d2
          WHERE d2.id = a.target_dept_id
             OR d2.id IN (
               SELECT at3.target_dept_id
               FROM announcement_targets at3
               WHERE at3.announcement_id = a.id AND at3.target_dept_id IS NOT NULL
             )
        ) as target_departments
      FROM announcements a
      LEFT JOIN users u ON u.id = a.created_by
      WHERE
        a.is_active = 1
        AND (
          a.visibility = 'all'
          OR (
            a.visibility = 'section'
            AND (
              a.target_section_id = ?
              OR EXISTS (
                SELECT 1
                FROM announcement_targets at
                WHERE at.announcement_id = a.id AND at.target_section_id = ?
              )
            )
          )
          OR (
            a.visibility = 'department'
            AND (
              a.target_dept_id = ?
              OR EXISTS (
                SELECT 1
                FROM announcement_targets at
                WHERE at.announcement_id = a.id AND at.target_dept_id = ?
              )
            )
          )
        )
      ORDER BY created_at DESC
      LIMIT ?`,
      [section_id || null, section_id || null, dept_id || null, dept_id || null, safeLimit]
    );

    const announcements = (rows || []).map((row) => ({
      ...row,
      type: row.announcementType === 'important' ? 'important' : 'regular',
      announcementType: row.announcementType || 'normal',
      title: row.title || 'Campus Announcement',
      source: row.creator_name || 'Faculty',
      category: 'announcement',
      channelType: 'announcement',
      target_sections: row.target_sections,
      target_departments: row.target_departments,
      createdAt: row.created_at,
      isAnnouncement: true
    }));

    return announcements;
  } catch (error) {
    console.error('[StudentService] Error fetching announcements:', error);
    return [];
  }
};

const getAssignmentsFeed = async ({ section_id, limit = 50 }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  try {
    const [rows] = await pool.execute(
      `SELECT
        a.id,
        a.title,
        a.description as content,
        a.due_date,
        a.attachment_url,
        a.allow_submission,
        a.created_at,
        u.name as creator_name,
        GROUP_CONCAT(DISTINCT s.name SEPARATOR ', ') as subjects,
        GROUP_CONCAT(DISTINCT sec.name SEPARATOR ', ') as sections
      FROM assignments a
      JOIN assignment_targets at ON at.assignment_id = a.id
      JOIN subject_offerings so ON so.id = at.subject_offering_id
      JOIN subjects s ON s.id = so.subject_id
      JOIN sections sec ON sec.id = so.section_id
      LEFT JOIN users u ON u.id = a.created_by
      WHERE a.is_active = 1 AND so.section_id = ?
      GROUP BY a.id
      ORDER BY a.created_at DESC
      LIMIT ?`,
      [section_id || null, safeLimit]
    );

    return (rows || []).map((row) => ({
      ...row,
      announcementType: 'normal',
      source: row.creator_name || 'Faculty',
      category: 'assignment',
      channelType: 'assignment',
      createdAt: row.created_at,
      isAssignment: true
    }));
  } catch (error) {
    console.error('[StudentService] Error fetching assignments feed:', error);
    return [];
  }
};

const getPollsFeed = async ({ user_id, dept_id, section_id, limit = 50 }) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

  try {
    const [rows] = await pool.execute(
      `SELECT
        p.id,
        p.question as title,
        p.question as content,
        p.options,
        p.created_at,
        p.created_by,
        u.name as creator_name,
        COUNT(DISTINCT pr.id) as response_count,
        GROUP_CONCAT(DISTINCT sec.name SEPARATOR ', ') as target_sections,
        (
          SELECT pr2.option_index
          FROM poll_responses pr2
          WHERE pr2.poll_id = p.id AND pr2.user_id = ?
          LIMIT 1
        ) as user_response
      FROM polls p
      LEFT JOIN poll_targets pt ON pt.poll_id = p.id
      LEFT JOIN sections sec ON sec.id = pt.target_section_id
      LEFT JOIN users u ON u.id = p.created_by
      LEFT JOIN poll_responses pr ON pr.poll_id = p.id
      WHERE
        p.is_active = 1
        AND (
          pt.target_section_id = ?
          OR pt.target_dept_id = ?
        )
      GROUP BY p.id
      ORDER BY p.created_at DESC
      LIMIT ?`,
      [user_id, section_id || null, dept_id || null, safeLimit]
    );

    return Promise.all(
      (rows || []).map(async (row) => {
        const options = JSON.parse(row.options || '[]');
        const breakdown = await pollService.getPollBreakdown(row.id, options);

        return {
          ...row,
          options,
          response_count: breakdown.response_count,
          option_results: breakdown.option_results,
          announcementType: 'normal',
          source: row.creator_name || 'Faculty',
          category: 'poll',
          channelType: 'poll',
          createdAt: row.created_at,
          user_response: row.user_response === null || row.user_response === undefined ? null : Number(row.user_response),
          isPoll: true
        };
      })
    );
  } catch (error) {
    console.error('[StudentService] Error fetching polls feed:', error);
    return [];
  }
};

const getFeed = async ({ user_id, dept_id, section_id, limit = 50 }) => {
  try {
    const [announcements, assignments, polls] = await Promise.all([
      getAnnouncements({ dept_id, section_id, limit }),
      getAssignmentsFeed({ section_id, limit }),
      getPollsFeed({ user_id, dept_id, section_id, limit })
    ]);

    const posts = [...announcements, ...assignments, ...polls]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, Math.min(Math.max(Number(limit) || 20, 1), 100));

    return { posts };
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
