const { execute } = require('../config/db');

const updatePresence = async (userId, isOnline) => {
  try {
    if (isOnline) {
      await execute(
        'UPDATE users SET is_online = 1, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
    } else {
      await execute(
        'UPDATE users SET is_online = 0, last_seen = CURRENT_TIMESTAMP WHERE id = ?',
        [userId]
      );
    }
  } catch (error) {
    console.error('Presence Update Failed:', error);
  }
};

const getUserStatus = async (userId) => {
  try {
    const [rows] = await execute(
      'SELECT is_online, last_seen FROM users WHERE id = ?',
      [userId]
    );
    return rows[0] || null;
  } catch (error) {
    console.error('Get User Status Failed:', error);
    return null;
  }
};

module.exports = {
  updatePresence,
  getUserStatus
};
