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
  createAnnouncement
};
