const adminService = require('../../services/admin.service');

const getStats = async (req, res) => {
  try {
    const { dept_id } = req.user; // From auth middleware
    const stats = await adminService.getDashboardStats(dept_id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const announcements = await adminService.getRecentAnnouncements(dept_id);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const activity = await adminService.getUserActivity(dept_id);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChannels = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const channels = await adminService.getChannels(dept_id);
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const {
      search = '',
      section_id,
      verification_status,
      is_active,
      page = 1,
      limit = 20
    } = req.query;

    const result = await adminService.getStudents({
      dept_id,
      search,
      section_id,
      verification_status,
      is_active,
      page,
      limit
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFaculty = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const {
      search = '',
      is_active,
      page = 1,
      limit = 20
    } = req.query;

    const result = await adminService.getFaculty({
      dept_id,
      search,
      is_active,
      page,
      limit
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createStudent = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const student = await adminService.createStudent({ dept_id, data: req.body });
    res.status(201).json(student);
  } catch (error) {
    const message = error.message || 'Failed to create student';
    const statusCode =
      message.includes('required') ||
      message.includes('already') ||
      message.includes('Invalid')
        ? 400
        : 500;
    res.status(statusCode).json({ error: message });
  }
};

const createFaculty = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const faculty = await adminService.createFaculty({ dept_id, data: req.body });
    res.status(201).json(faculty);
  } catch (error) {
    const message = error.message || 'Failed to create faculty';
    const statusCode =
      message.includes('required') ||
      message.includes('already') ||
      message.includes('Invalid')
        ? 400
        : 500;
    res.status(statusCode).json({ error: message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { id: sender_id, dept_id } = req.user;
    const { channel_id, content } = req.body;
    
    if (!channel_id || !content) {
      return res.status(400).json({ error: 'Missing channel_id or content' });
    }

    const announcement = await adminService.createAnnouncement({
      sender_id,
      dept_id,
      channel_id,
      content
    });
    
    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStats,
  getAnnouncements,
  getActivity,
  getChannels,
  getStudents,
  getFaculty,
  createStudent,
  createFaculty,
  createAnnouncement
};
