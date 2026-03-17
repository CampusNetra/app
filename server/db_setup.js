const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'campus_netra',
});

async function run() {
  try {
    console.log('--- Database Setup for Testing ---');
    
    // 1. Get the admin whose email is admin@gu.in
    const [users] = await pool.execute('SELECT id, name, dept_id FROM users WHERE email = ?', ['admin@gu.in']);

    if (users.length === 0) {
      console.log('No admin with email admin@gu.in found. Checking first available admin...');
      const [allAdmins] = await pool.execute('SELECT id, name, dept_id FROM users WHERE role = "dept_admin" LIMIT 1');
      if (allAdmins.length === 0) {
         console.error('No admins found in the database. Please register an admin first.');
         process.exit(1);
      }
      var admin = allAdmins[0];
    } else {
      var admin = users[0];
    }

    console.log(`Using Admin: ${admin.name} (ID: ${admin.id}, Dept ID: ${admin.dept_id})`);

    // 2. Insert dummy channels if they don't exist
    const testChannels = [
      { name: 'General Announcements', type: 'branch' },
      { name: 'Faculty Notifications', type: 'section' },
      { name: 'Student Portal', type: 'subject' }
    ];

    for (const ch of testChannels) {
      const [existing] = await pool.execute(
        'SELECT id FROM channels WHERE name = ? AND dept_id = ?',
        [ch.name, admin.dept_id]
      );

      let channelId;
      if (existing.length === 0) {
        const [insertResult] = await pool.execute(
          'INSERT INTO channels (name, type, dept_id) VALUES (?, ?, ?)',
          [ch.name, ch.type, admin.dept_id]
        );
        channelId = insertResult.insertId;
        console.log(`✅ Created channel: ${ch.name} (ID: ${channelId})`);
        
        // 3. Add admin as member for reach testing
        await pool.execute(
          'INSERT INTO channel_members (channel_id, user_id) VALUES (?, ?)',
          [channelId, admin.id]
        );
        console.log(`   - Added admin as member of ${ch.name}`);
      } else {
        channelId = existing[0].id;
        console.log(`ℹ️ Channel already exists: ${ch.name} (ID: ${channelId})`);
      }

      // 4. Create a dummy announcement message if none exists
      const [messages] = await pool.execute(
        'SELECT id FROM messages WHERE channel_id = ? AND type = "announcement" LIMIT 1',
        [channelId]
      );

      if (messages.length === 0) {
        await pool.execute(
          'INSERT INTO messages (channel_id, sender_id, content, type) VALUES (?, NULL, ?, "announcement")',
          [channelId, `Test announcement for ${ch.name}`]
        );
        console.log(`   - Posted dummy announcement to ${ch.name}`);
      }
    }

    console.log('--- Setup Complete ---');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during setup:', err);
    process.exit(1);
  }
}

run();
