const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

// Detection for Cloudflare Environment (e.g. D1 binding 'DB' exists globally)
if (typeof globalThis.DB !== 'undefined' || typeof process.env.DB !== 'undefined') {
  const d1 = globalThis.DB || process.env.DB;
  
  // Shim for D1 to match mysql2/promise .execute behavior
  pool = {
    execute: async (sql, params = []) => {
      // D1 uses '?' for placeholders, same as mysql2
      const result = await d1.prepare(sql).bind(...params).all();
      // Result structure: { success: true, results: [...], meta: {...} }
      return [result.results, result.meta];
    }
  };
} else {
  // Local MySQL Setup
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'campus_netra',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : null
  });
}

module.exports = pool;
