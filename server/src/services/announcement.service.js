const pool = require('../config/db');

const createAnnouncement = async (data) => {
  const { title, content, type = 'normal', visibility = 'all', targets = [], created_by } = data;

  if (!title || !content || !created_by) {
    throw new Error('Title, content, and created_by are required');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.execute(
      `INSERT INTO announcements 
       (title, content, type, visibility, created_by, is_active) 
       VALUES (?, ?, ?, ?, ?, 1)`,
      [title.trim(), content.trim(), type, visibility, created_by]
    );

    const announcementId = result.insertId;

    // Handle multi-targets
    if (targets && targets.length > 0) {
      for (const target of targets) {
        // target expected to be { type: 'section'|'department', id: number }
        if (target.type === 'section') {
           await connection.execute(
             `INSERT INTO announcement_targets (announcement_id, target_section_id) VALUES (?, ?)`,
             [announcementId, target.id]
           );
        } else if (target.type === 'department') {
           await connection.execute(
             `INSERT INTO announcement_targets (announcement_id, target_dept_id) VALUES (?, ?)`,
             [announcementId, target.id]
           );
        }
      }
    }

    await connection.commit();
    console.log('[AnnouncementService] Announcement created with ID:', announcementId);

    return {
      id: announcementId,
      title,
      content,
      type,
      visibility,
      targets,
      created_by,
      is_active: 1
    };
  } catch (error) {
    await connection.rollback();
    console.error('[AnnouncementService] Error creating announcement:', error);
    throw new Error(`Failed to create announcement: ${error.message}`);
  } finally {
    connection.release();
  }
};

const getAnnouncements = async (filters = {}) => {
  const { limit = 50, offset = 0, type, visibility, is_active = 1 } = filters;

  try {
    let query = 'SELECT * FROM announcements WHERE is_active = ?';
    const params = [is_active];

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    if (visibility) {
      query += ' AND visibility = ?';
      params.push(visibility);
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await pool.execute(query, params);
    return rows || [];
  } catch (error) {
    console.error('[AnnouncementService] Error fetching announcements:', error);
    throw new Error(`Failed to fetch announcements: ${error.message}`);
  }
};

const updateAnnouncement = async (id, data) => {
  const { title, content, type, visibility, target_section_id, target_dept_id } = data;

  try {
    const updates = [];
    const params = [];

    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }

    if (content !== undefined) {
      updates.push('content = ?');
      params.push(content);
    }

    if (type !== undefined) {
      updates.push('type = ?');
      params.push(type);
    }

    if (visibility !== undefined) {
      updates.push('visibility = ?');
      params.push(visibility);
    }

    if (target_section_id !== undefined) {
      updates.push('target_section_id = ?');
      params.push(visibility === 'section' ? target_section_id : null);
    }

    if (target_dept_id !== undefined) {
      updates.push('target_dept_id = ?');
      params.push(visibility === 'department' ? target_dept_id : null);
    }

    if (updates.length === 0) {
      throw new Error('No fields to update');
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const query = `UPDATE announcements SET ${updates.join(', ')} WHERE id = ?`;
    const [result] = await pool.execute(query, params);

    console.log('[AnnouncementService] Announcement updated:', id);

    return { success: true, id };
  } catch (error) {
    console.error('[AnnouncementService] Error updating announcement:', error);
    throw new Error(`Failed to update announcement: ${error.message}`);
  }
};

const deleteAnnouncement = async (id) => {
  try {
    const [result] = await pool.execute(
      'UPDATE announcements SET is_active = 0 WHERE id = ?',
      [id]
    );

    console.log('[AnnouncementService] Announcement deleted:', id);

    return { success: true, id };
  } catch (error) {
    console.error('[AnnouncementService] Error deleting announcement:', error);
    throw new Error(`Failed to delete announcement: ${error.message}`);
  }
};

const getFacultyAnnouncements = async (faculty_id) => {
  try {
    const [rows] = await pool.execute(`
      SELECT a.*, 
        GROUP_CONCAT(DISTINCT sec.name SEPARATOR ', ') as target_sections,
        GROUP_CONCAT(DISTINCT d.name SEPARATOR ', ') as target_depts
      FROM announcements a
      LEFT JOIN announcement_targets at ON at.announcement_id = a.id
      LEFT JOIN sections sec ON sec.id = at.target_section_id
      LEFT JOIN departments d ON d.id = at.target_dept_id
      WHERE a.created_by = ?
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `, [faculty_id]);
    return rows;
  } catch (error) {
    console.error('[AnnouncementService] Error fetching faculty announcements:', error);
    throw error;
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getFacultyAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};
