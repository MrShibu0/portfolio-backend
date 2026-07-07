const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'portfolio_secret_key_2026');

      // Get user from token and attach to request
      req.user = await AdminUser.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User record not found.' });
      }

      next();
    } catch (error) {
      console.error('JWT validation error:', error.message);
      return res.status(401).json({ message: 'Not authorized, session token invalid or expired.' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no authorization header token found.' });
  }
};

module.exports = { protect };
