const announcementService = require('../../services/announcement.service');

const createAnnouncement = async (req, res) => {
  try {
    const { id: faculty_id } = req.user;
    const { title, content, type = 'normal', visibility = 'all', targets = [] } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcement = await announcementService.createAnnouncement({
      title,
      content,
      type,
      visibility,
      targets,
      created_by: faculty_id
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error('[FacultyAnnouncementController] Error creating announcement:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMyAnnouncements = async (req, res) => {
  try {
    const { id: faculty_id } = req.user;
    const announcements = await announcementService.getFacultyAnnouncements(faculty_id);
    res.json(announcements);
  } catch (error) {
    console.error('[FacultyAnnouncementController] Error fetching announcements:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getMyAnnouncements
};
