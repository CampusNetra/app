const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
  if (typeof globalThis !== 'undefined' && globalThis.JWT_SECRET) {
    return globalThis.JWT_SECRET;
  }
  return process.env.JWT_SECRET || 'campus_netra_secret_key_123';
};

module.exports = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.log('[authMiddleware] No token provided');
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    console.log('[authMiddleware] Token verified successfully');
    console.log('[authMiddleware] Decoded token:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[authMiddleware] Token verification failed:', err.message);
    res.status(401).json({ error: 'Token is not valid' });
  }
};
