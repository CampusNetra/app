const announcementService = require('../../services/announcement.service');

const postAnnouncement = async (req, res) => {
  try {
    const { id: created_by } = req.user;
    const { title, content, type = 'normal', visibility = 'all', target_section_id, target_dept_id } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcement = await announcementService.createAnnouncement({
      title,
      content,
      type,
      visibility,
      target_section_id,
      target_dept_id,
      created_by
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error('[AnnouncementController] Error posting announcement:', error);
    res.status(500).json({ error: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const { limit = 50, offset = 0, type, visibility } = req.query;

    const announcements = await announcementService.getAnnouncements({
      limit: Math.min(Math.max(Number(limit) || 50, 1), 100),
      offset: Math.max(Number(offset) || 0, 0),
      type,
      visibility,
      is_active: 1
    });

    res.json(announcements);
  } catch (error) {
    console.error('[AnnouncementController] Error fetching announcements:', error);
    res.status(500).json({ error: error.message });
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, type, visibility, target_section_id, target_dept_id } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Announcement ID is required' });
    }

    const result = await announcementService.updateAnnouncement(id, {
      title,
      content,
      type,
      visibility,
      target_section_id,
      target_dept_id
    });

    res.json(result);
  } catch (error) {
    console.error('[AnnouncementController] Error updating announcement:', error);
    res.status(500).json({ error: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Announcement ID is required' });
    }

    const result = await announcementService.deleteAnnouncement(id);
    res.json(result);
  } catch (error) {
    console.error('[AnnouncementController] Error deleting announcement:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  postAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement
};
