const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/student-login', authController.studentLogin);
router.post('/student-register-check', authController.studentRegisterCheck);
router.post('/student-set-password', authController.studentSetPassword);

// Faculty Auth Routes
router.post('/faculty-login', authController.facultyLogin);
router.post('/faculty-register-check', authController.facultyRegisterCheck);
router.post('/faculty-set-password', authController.facultySetPassword);

module.exports = router;
