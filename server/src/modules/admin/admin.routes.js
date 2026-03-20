const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');
const authMiddleware = require('../../utils/auth.middleware');

router.get('/stats', authMiddleware, adminController.getStats);
router.get('/announcements', authMiddleware, adminController.getAnnouncements);
router.get('/activity', authMiddleware, adminController.getActivity);
router.get('/channels', authMiddleware, adminController.getChannels);
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
router.get('/offerings', authMiddleware, adminController.getSubjectOfferings);
router.post('/offerings/assign-faculty', authMiddleware, adminController.createSubjectOffering);
router.post('/announcements', authMiddleware, adminController.createAnnouncement);

module.exports = router;
