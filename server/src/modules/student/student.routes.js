const express = require('express');
const router = express.Router();
const authMiddleware = require('../../utils/auth.middleware');
const studentController = require('./student.controller');

router.get('/feed', authMiddleware, studentController.getFeed);

module.exports = router;
