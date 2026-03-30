const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  if (typeof globalThis !== 'undefined' && globalThis.JWT_SECRET) {
    return globalThis.JWT_SECRET;
  }
  return process.env.JWT_SECRET || 'campus_netra_secret_key_123';
};

const normalizeToken = (rawToken) => {
  if (!rawToken || typeof rawToken !== 'string') return null;
  return rawToken.startsWith('Bearer ') ? rawToken.slice(7) : rawToken;
};

const attachSocketAuth = (io) => {
  io.use((socket, next) => {
    try {
      const rawToken = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      const token = normalizeToken(rawToken);

      if (!token) {
        return next(new Error('Authentication error'));
      }

      const user = jwt.verify(token, getJwtSecret());
      socket.user = user;
      return next();
    } catch (error) {
      return next(new Error('Authentication error'));
    }
  });
};

const presenceService = require('../services/presence.service');

const registerChatHandlers = (socket, io) => {
  const userId = socket.user?.id;
  if (userId) {
    presenceService.updatePresence(userId, true);
    // Broadcast presence update if needed
    io.emit('user:presence', { userId, is_online: 1 });
  }

  socket.on('disconnect', () => {
    if (userId) {
      presenceService.updatePresence(userId, false);
      io.emit('user:presence', { userId, is_online: 0, last_seen: new Date() });
    }
  });

  socket.on('chat:join-channel', (payload = {}) => {
    const channelId = Number(payload.channelId);
    if (!channelId) return;
    socket.join(`chat:channel:${channelId}`);
  });

  socket.on('chat:leave-channel', (payload = {}) => {
    const channelId = Number(payload.channelId);
    if (!channelId) return;
    socket.leave(`chat:channel:${channelId}`);
  });
};

module.exports = {
  attachSocketAuth,
  registerChatHandlers
};