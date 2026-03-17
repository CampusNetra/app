const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const authMiddleware = require('../../utils/auth.middleware');

router.get('/stats', authMiddleware, adminController.getStats);
router.get('/announcements', authMiddleware, adminController.getAnnouncements);
router.get('/activity', authMiddleware, adminController.getActivity);
router.get('/channels', authMiddleware, adminController.getChannels);
router.post('/announcements', authMiddleware, adminController.createAnnouncement);

module.exports = router;
