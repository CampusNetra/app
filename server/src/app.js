const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const termsRoutes = require('./modules/terms/terms.routes');
const adminRoutes = require('./modules/admin/admin.routes');
const studentRoutes = require('./modules/student/student.routes');
const facultyRoutes = require('./modules/faculty/faculty.routes');

const announcementRoutes = require('./modules/admin/announcement.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/announcements', announcementRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusNetra API is running' });
});

module.exports = app;
