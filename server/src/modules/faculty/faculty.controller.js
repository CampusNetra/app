const facultyService = require('../../services/faculty.service');

const getDashboard = async (req, res) => {
  try {
    const faculty_id = req.user.id; // From auth middleware
    const data = await facultyService.getFacultyDashboard(faculty_id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTargets = async (req, res) => {
  try {
    const faculty_id = req.user.id;
    const data = await facultyService.getFacultyTargets(faculty_id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const subjects = await facultyService.getFacultySubjects(req.user.id);
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
};

module.exports = {
  getDashboard,
  getTargets,
  getSubjects
};
