const studentService = require('../../services/student.service');
const pollService = require('../../services/poll.service');

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

const respondToPoll = async (req, res) => {
  try {
    const user = req.user || {};
    if (!user || !user.id || user.role !== 'student') {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const poll_id = Number(req.params.id);
    const option_index = Number(req.body?.option_index);

    const result = await pollService.submitPollResponse({
      poll_id,
      option_index,
      user_id: user.id,
      dept_id: user.dept_id,
      section_id: user.section_id
    });

    return res.json(result);
  } catch (error) {
    console.error('[StudentController] Poll Response Error:', error);
    return res.status(400).json({ error: error.message || 'Failed to submit poll response' });
  }
};

module.exports = {
  getFeed,
  getProfile,
  respondToPoll
};
