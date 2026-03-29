const adminService = require('../../services/admin.service');
const fs = require('fs');
const csv = require('csv-parser');

const getStats = async (req, res) => {
  try {
    const deptId = req.user?.dept_id ?? null;
    const stats = await adminService.getDashboardStats(deptId);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const deptId = req.user?.dept_id ?? null;
    const announcements = await adminService.getRecentAnnouncements(deptId);
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActivity = async (req, res) => {
  try {
    const deptId = req.user?.dept_id ?? null;
    const activity = await adminService.getUserActivity(deptId);
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

const createChannel = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const result = await adminService.createChannel({ dept_id, ...req.body });
    res.status(201).json(result);
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
    
    if (!req.body.content) {
      return res.status(400).json({ error: 'Missing content' });
    }

    const announcement = await adminService.createAnnouncement({
      sender_id,
      dept_id,
      ...req.body
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

const importStudents = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { dept_id } = req.user;
  const results = [];
  
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const importResult = await adminService.importStudents({ dept_id, students: results });
        fs.unlinkSync(req.file.path); // Clean up
        res.json(importResult);
      } catch (error) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
      }
    });
};

const importFaculty = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const { dept_id } = req.user;
  const results = [];
  
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      try {
        const importResult = await adminService.importFaculty({ dept_id, faculty: results });
        fs.unlinkSync(req.file.path); // Clean up
        res.json(importResult);
      } catch (error) {
        fs.unlinkSync(req.file.path);
        res.status(500).json({ error: error.message });
      }
    });
};

const getChatChannels = async (req, res) => {
  try {
    const { id: user_id, dept_id } = req.user;
    const channels = await adminService.getChatChannels(user_id, dept_id);
    res.json(channels);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChannelMessages = async (req, res) => {
  try {
    const { id: channel_id } = req.params;
    const { limit = 50 } = req.query;
    const messages = await adminService.getChannelMessages(channel_id, limit);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChatChannelDetails = async (req, res) => {
  try {
    const { id: channel_id } = req.params;
    const { dept_id } = req.user;
    const details = await adminService.getChatChannelDetails(channel_id, dept_id);
    res.json(details);
  } catch (error) {
    res.status(error.message.includes('not found') ? 404 : 500).json({ error: error.message });
  }
};

const getMessageReplies = async (req, res) => {
  try {
    const { id: message_id } = req.params;
    const { limit = 100 } = req.query;
    const replies = await adminService.getMessageReplies(message_id, limit);
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { id: channel_id } = req.params;
    const { id: sender_id } = req.user;
    const { content, type, parent_id } = req.body;
    
    const message = await adminService.sendMessage({
      channel_id,
      sender_id,
      content,
      type,
      parent_id
    });

    const io = req.app.get('io');
    if (io && message) {
      io.to(`chat:channel:${Number(channel_id)}`).emit('chat:new-message', message);
    }
    
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendReply = async (req, res) => {
  try {
    const { id: parent_id } = req.params;
    const { id: sender_id } = req.user;
    const { content } = req.body;

    const message = await adminService.sendMessage({
      channel_id: null,
      sender_id,
      content,
      type: 'text',
      parent_id
    });

    const io = req.app.get('io');
    if (io && message) {
      io.to(`chat:channel:${Number(message.channel_id)}`).emit('chat:new-message', message);
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getChannelEligibleUsers = async (req, res) => {
  try {
    const { dept_id } = req.user;
    const users = await adminService.getChannelMemberEligibleUsers(dept_id);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const syncChannelMembers = async (req, res) => {
  try {
    const { id: channel_id } = req.params;
    const { userIds } = req.body;
    const result = await adminService.syncChannelMembers({ channel_id, user_ids: userIds });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getStats,
  getAnnouncements,
  getActivity,
  getChannels,
  createChannel,
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
  createAnnouncement,
  importStudents,
  importFaculty,
  getChatChannels,
  getChatChannelDetails,
  getChannelMessages,
  getMessageReplies,
  sendMessage,
  sendReply,
  getChannelEligibleUsers,
  syncChannelMembers
};
