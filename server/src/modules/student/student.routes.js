const express = require('express');
const router = express.Router();
const authMiddleware = require('../../utils/auth.middleware');
const studentController = require('./student.controller');
const chatController = require('./chat.controller');

router.get('/feed', authMiddleware, studentController.getFeed);

// Chat Routes
router.get('/chat/channels', authMiddleware, chatController.getChannels);
router.get('/chat/channels/:id', authMiddleware, chatController.getChannelDetails);
router.get('/chat/channels/:id/messages', authMiddleware, chatController.getChannelMessages);
router.post('/chat/channels/:id/messages', authMiddleware, chatController.sendMessage);
router.get('/chat/messages/:id/replies', authMiddleware, chatController.getMessageReplies);

module.exports = router;
