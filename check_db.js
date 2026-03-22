const { execute } = require('./server/src/config/db');

async function checkTables() {
  try {
    const [rows] = await execute('SHOW TABLES');
    console.log('Tables in database:', rows);
  } catch (err) {
    console.error('Error checking tables:', err);
  }
  process.exit();
}

checkTables();
