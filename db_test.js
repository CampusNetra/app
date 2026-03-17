const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'campus_netra',
});

async function run() {
  try {
    // 1. Get the admin whose email is admin@gu.in
    const [users] = await pool.execute('SELECT id, name, dept_id FROM users WHERE email = ?', ['admin@gu.in']);

    if (users.length === 0) {
      console.log('No admin with email admin@gu.in found.');
      process.exit(0);
    }

    const admin = users[0];
    console.log(`Found Admin: ${admin.name} (ID: ${admin.id}, Dept ID: ${admin.dept_id})`);

    // 2. See if there are existing channels for this dept
    const [channels] = await pool.execute('SELECT * FROM channels WHERE dept_id = ?', [admin.dept_id]);
    console.log(`Current channels for Department ${admin.dept_id}: ${channels.length}`);

    // 3. Insert a dummy Global Announcement channel if it doesn't exist
    const [insertResult] = await pool.execute(
      'INSERT INTO channels (name, type, dept_id) VALUES (?, ?, ?)',
      ['General Announcements', 'global', admin.dept_id]
    );
    console.log(`Inserted dummy channel with ID: ${insertResult.insertId}`);

    // 4. Add the admin as a member to this channel (needed?)
    // Based on campus_netra.sql, let's see if there's a channel_members table.
    // I recall reach being calculated from channel_members.
    await pool.execute(
      'INSERT INTO channel_members (channel_id, user_id) VALUES (?, ?)',
      [insertResult.insertId, admin.id]
    );
    console.log('Added admin as member of the new channel.');

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

run();
