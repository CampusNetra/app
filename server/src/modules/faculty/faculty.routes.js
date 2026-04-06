const express = require('express');
const router = express.Router();
const facultyController = require('./faculty.controller');
const assignmentController = require('./assignment.controller');
const pollController = require('./poll.controller');
const announcementController = require('./announcement.controller');
const chatController = require('../student/chat.controller'); // Reuse chat controller
const authMiddleware = require('../../utils/auth.middleware');

// Apply authMiddleware globally to all faculty routes
router.use(authMiddleware);

// Core Dashboard & Profile
router.get('/dashboard', facultyController.getDashboard);
router.get('/subjects', facultyController.getSubjects);
router.get('/targets', facultyController.getTargets);

// Assignments
router.post('/assignments', assignmentController.createAssignment);
router.get('/assignments', assignmentController.getMyAssignments);

// Announcements
router.post('/announcements', announcementController.createAnnouncement);
router.get('/announcements', announcementController.getMyAnnouncements);

// Polls
router.get('/polls', pollController.getMyPolls);
router.post('/polls', pollController.createPoll);

// Chat
router.get('/chat/channels', chatController.getChannels);
router.get('/chat/channels/:id', chatController.getChannelDetails);
router.get('/chat/channels/:id/messages', chatController.getChannelMessages);
router.post('/chat/channels/:id/messages', chatController.sendMessage);
router.get('/chat/messages/:id/replies', chatController.getMessageReplies);
router.put('/chat/messages/:id', chatController.editMessage);
router.delete('/chat/messages/:id', chatController.deleteMessage);
router.post('/chat/channels/:id/read', chatController.markAsRead);

module.exports = router;
