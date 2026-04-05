const announcementService = require('../../services/announcement.service');

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
  getMyAnnouncements
};
