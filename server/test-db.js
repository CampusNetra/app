const db = require('./src/config/db');
db.execute('SELECT 1').then(() => {
  console.log('DB Connection SUCCESS');
  process.exit(0);
}).catch((err) => {
  console.error('DB Connection FAILED:', err.message);
  process.exit(1);
});
