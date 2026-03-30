const studentService = require('../../services/student.service');

const getFeed = async (req, res) => {
  try {
    const user = req.user || {};
    if (!user || !user.id || user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = await studentService.getFeed({
      user_id: user.id,
      dept_id: user.dept_id,
      section_id: user.section_id,
      limit: req.query.limit || 50
    });

    return res.json(data);
  } catch (error) {
    console.error('[StudentController] Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch student feed' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = req.user || {};
    if (!user || !user.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const data = await studentService.getProfile(user.id);
    return res.json(data);
  } catch (error) {
    console.error('[StudentController] Profile Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch profile' });
  }
};

module.exports = {
  getFeed,
  getProfile
};
