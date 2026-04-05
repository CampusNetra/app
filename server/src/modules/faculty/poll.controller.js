const pollService = require('../../services/poll.service');

const createPoll = async (req, res) => {
  try {
    const { id: created_by } = req.user;
    const { question, options, targets } = req.body;

    if (!question || !options || options.length < 2) {
        return res.status(400).json({ error: 'Question and at least 2 options are required' });
    }

    const poll = await pollService.createPoll({
      question,
      options,
      targets,
      created_by
    });

    res.status(201).json(poll);
  } catch (error) {
    console.error('[PollController] Error creating poll:', error);
    res.status(500).json({ error: error.message });
  }
};

const getMyPolls = async (req, res) => {
  try {
    const { id: faculty_id } = req.user;
    const polls = await pollService.getFacultyPolls(faculty_id);
    res.status(200).json(polls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPoll,
  getMyPolls
};
