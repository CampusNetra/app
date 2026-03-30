const { execute } = require('../config/db');

const createNotification = async (app, userId, { type, title, message, data = {} }) => {
  try {
    const [result] = await execute(
      'INSERT INTO notifications (user_id, type, title, message, data) VALUES (?, ?, ?, ?, ?)',
      [userId, type, title, message, JSON.stringify(data)]
    );

    const io = app.get('io');
    if (io) {
      io.to(`user:${userId}`).emit('notification:new', {
        id: result.insertId,
        type,
        title,
        message,
        data,
        is_read: 0,
        created_at: new Date()
      });
    }

    return result.insertId;
  } catch (error) {
    console.error('Create Notification Failed:', error);
    return null;
  }
};

const getUserNotifications = async (userId, limit = 20) => {
  try {
    const [rows] = await execute(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
      [userId, limit]
    );
    return rows.map(r => ({
      ...r,
      data: r.data ? (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) : {}
    }));
  } catch (error) {
    console.error('Get Notifications Failed:', error);
    return [];
  }
};

const markAsRead = async (notificationId, userId) => {
  try {
    await execute(
      'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
      [notificationId, userId]
    );
    return true;
  } catch (error) {
    console.error('Mark Notification Read Failed:', error);
    return false;
  }
};

module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead
};
