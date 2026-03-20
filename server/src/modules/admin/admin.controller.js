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
    const { type } = req.query;
    const channels = await adminService.getChannels(dept_id, type);
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClubs = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const clubs = await adminService.getClubs(dept_id);
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createClub = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const club = await adminService.createClub({ dept_id, ...req.body });
    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateClub = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminService.updateClub(id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteClub = async (req, res) => {
  try {
    const { id } = req.params;
    await adminService.deleteClub(id);
    res.json({ message: 'Club deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteChannel = async (req, res) => {
  try {
    const { id } = req.params;
    await adminService.deleteChannel(id);
    res.json({ message: 'Channel deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReports = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const reports = await adminService.getReports(dept_id);
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resolveReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    await adminService.resolveReport(id, action);
    res.json({ message: 'Report resolved' });
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

const getDepartments = async (req, res) => {
  try {
    const { role, dept_id } = req.user;
    // Only super_admin can see all departments
    const deptIdToFetch = role === 'super_admin' ? null : dept_id;
    const departments = await adminService.getDepartments(deptIdToFetch);
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createDepartment = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'super_admin') {
      return res.status(403).json({ error: 'Only super admins can create departments' });
    }
    const { name } = req.body;
    const department = await adminService.createDepartment(name);
    res.status(201).json(department);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSections = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const sections = await adminService.getSections(dept_id);
    res.json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSection = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { name } = req.body;
    const section = await adminService.createSection({ dept_id, name });
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubjects = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const subjects = await adminService.getSubjects(dept_id);
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { name } = req.body;
    const subject = await adminService.createSubject({ dept_id, name });
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { id } = req.params;
    const subject = await adminService.updateSubject(dept_id, id, req.body);
    res.json(subject);
  } catch (error) {
    res.status(error.message === 'Subject not found' ? 404 : 500).json({ error: error.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { id } = req.params;
    await adminService.deleteSubject(dept_id, id);
    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    if (error.message.includes('active faculty assignments')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(error.message === 'Subject not found' ? 404 : 500).json({ error: error.message });
  }
};

const getSubjectOfferings = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { section_id } = req.query;
    const offerings = await adminService.getSubjectOfferings(dept_id, section_id);
    res.json(offerings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSubjectOffering = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { subject_id, section_id, faculty_id, term_id } = req.body;
    const offering = await adminService.createSubjectOffering({
      subject_id,
      section_id,
      faculty_id,
      term_id,
      dept_id
    });
    res.status(201).json(offering);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateSubjectOffering = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { id } = req.params;
    const result = await adminService.updateSubjectOffering(dept_id, id, req.body);
    res.json(result);
  } catch (error) {
    res.status(error.message === 'Offering not found' ? 404 : 500).json({ error: error.message });
  }
};

const deleteSubjectOffering = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { id } = req.params;
    await adminService.deleteSubjectOffering(dept_id, id);
    res.json({ message: 'Offering deleted successfully' });
  } catch (error) {
    res.status(error.message === 'Offering not found' ? 404 : 500).json({ error: error.message });
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

const updateStudent = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { id: userId } = req.params;
    const result = await adminService.updateUser({ dept_id, userId, data: req.body });
    res.json(result);
  } catch (error) {
    res.status(error.message === 'User not found in this department' ? 404 : 500).json({ error: error.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const { id: userId } = req.params;
    const result = await adminService.updateUser({ dept_id, userId, data: req.body });
    res.json(result);
  } catch (error) {
    res.status(error.message === 'User not found in this department' ? 404 : 500).json({ error: error.message });
  }
};

module.exports = {
  getStats,
  getAnnouncements,
  getActivity,
  getChannels,
  getClubs,
  createClub,
  updateClub,
  deleteClub,
  deleteChannel,
  getReports,
  resolveReport,
  getStudents,
  getFaculty,
  createStudent,
  createFaculty,
  updateStudent,
  updateFaculty,
  getDepartments,
  createDepartment,
  getSections,
  createSection,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectOfferings,
  createSubjectOffering,
  updateSubjectOffering,
  deleteSubjectOffering,
  createAnnouncement
};
