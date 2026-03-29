const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/student-login', authController.studentLogin);

module.exports = router;
