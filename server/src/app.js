const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const termsRoutes = require('./modules/terms/terms.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/terms', termsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'CampusNetra API is running' });
});

module.exports = app;
