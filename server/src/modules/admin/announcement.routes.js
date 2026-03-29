const express = require('express');
const router = express.Router();
const announcementController = require('./announcement.controller');
const authMiddleware = require('../../utils/auth.middleware');

// Get announcements (admin)
router.get('/', authMiddleware, announcementController.getAnnouncements);

// Post new announcement (admin only)
router.post('/', authMiddleware, announcementController.postAnnouncement);

// Update announcement (admin only)
router.put('/:id', authMiddleware, announcementController.updateAnnouncement);

// Delete announcement (admin only)
router.delete('/:id', authMiddleware, announcementController.deleteAnnouncement);

module.exports = router;
