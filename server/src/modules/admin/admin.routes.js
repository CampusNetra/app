const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const authMiddleware = require('../../utils/auth.middleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/stats', authMiddleware, adminController.getStats);
router.get('/announcements', authMiddleware, adminController.getAnnouncements);
router.get('/activity', authMiddleware, adminController.getActivity);
router.get('/channels', authMiddleware, adminController.getChannels);
router.post('/channels', authMiddleware, adminController.createChannel);
router.get('/students', authMiddleware, adminController.getStudents);
router.get('/faculty', authMiddleware, adminController.getFaculty);
router.post('/students', authMiddleware, adminController.createStudent);
router.put('/students/:id', authMiddleware, adminController.updateStudent);
router.post('/faculty', authMiddleware, adminController.createFaculty);
router.put('/faculty/:id', authMiddleware, adminController.updateFaculty);
router.get('/departments', authMiddleware, adminController.getDepartments);
router.post('/departments', authMiddleware, adminController.createDepartment);
router.get('/sections', authMiddleware, adminController.getSections);
router.post('/sections', authMiddleware, adminController.createSection);
router.get('/subjects', authMiddleware, adminController.getSubjects);
router.post('/subjects', authMiddleware, adminController.createSubject);
router.put('/subjects/:id', authMiddleware, adminController.updateSubject);
router.delete('/subjects/:id', authMiddleware, adminController.deleteSubject);
router.get('/subjects/:id/analytics', authMiddleware, adminController.getSubjectAnalytics);
router.post('/subjects/:id/create-channels', authMiddleware, adminController.createSubjectChannels);
router.get('/offerings', authMiddleware, adminController.getSubjectOfferings);
router.post('/offerings/assign-faculty', authMiddleware, adminController.createSubjectOffering);
router.put('/offerings/:id', authMiddleware, adminController.updateSubjectOffering);
router.delete('/offerings/:id', authMiddleware, adminController.deleteSubjectOffering);
router.post('/announcements', authMiddleware, adminController.createAnnouncement);

// Bulk Import
router.post('/import-students', authMiddleware, upload.single('file'), adminController.importStudents);
router.post('/import-faculty', authMiddleware, upload.single('file'), adminController.importFaculty);

// Clubs
router.get('/clubs', authMiddleware, adminController.getClubs);
router.post('/clubs', authMiddleware, adminController.createClub);
router.put('/clubs/:id', authMiddleware, adminController.updateClub);
router.delete('/clubs/:id', authMiddleware, adminController.deleteClub);

// Moderation
router.get('/reports', authMiddleware, adminController.getReports);
router.post('/reports/:id/resolve', authMiddleware, adminController.resolveReport);
router.delete('/channels/:id', authMiddleware, adminController.deleteChannel);
router.get('/channels/eligible-users', authMiddleware, adminController.getChannelEligibleUsers);
router.post('/channels/:id/members', authMiddleware, adminController.syncChannelMembers);

// Chat System
router.get('/chat/channels', authMiddleware, adminController.getChatChannels);
router.get('/chat/channels/:id/details', authMiddleware, adminController.getChatChannelDetails);
router.get('/chat/channels/:id/messages', authMiddleware, adminController.getChannelMessages);
router.get('/chat/messages/:id/replies', authMiddleware, adminController.getMessageReplies);
router.post('/chat/messages/:id/replies', authMiddleware, adminController.sendReply);
router.post('/chat/channels/:id/messages', authMiddleware, adminController.sendMessage);

module.exports = router;
