const mysql = require('mysql2/promise');
require('dotenv').config();

// Note: If deploying to Cloudflare Workers with D1, this pool setup will need 
// to be replaced with the Cloudflare D1 client (env.DB.prepare).
// For Node.js hosts (Render/Railway), this configuration works correctly.

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'campus_netra',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
});

module.exports = pool;
