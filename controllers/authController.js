const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AdminUser = require('../models/AdminUser');
const ActivityLog = require('../models/ActivityLog');

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'portfolio_secret_key_2026', {
    expiresIn: '24h' // Access Token valid for 24h
  });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await AdminUser.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid admin credentials.' });
    }

    const token = generateToken(user._id);

    // Log login activity
    await ActivityLog.create({
      username: user.username,
      action: 'LOGIN',
      details: `Successful login from IP ${req.ip}`
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify current session
// @route   GET /api/auth/verify
// @access  Private
const verifyToken = async (req, res, next) => {
  try {
    res.json({
      valid: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change admin password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password fields are required.' });
    }

    const user = await AdminUser.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password verification failed.' });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    await ActivityLog.create({
      username: req.user.username,
      action: 'CHANGE_PASSWORD',
      details: 'Admin changed password successfully.'
    });

    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed initial admin (Run once internally on start)
const seedAdmin = async () => {
  try {
    const adminExists = await AdminUser.findOne({ username: 'Shibu' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Shibu2026', salt);

      await AdminUser.create({
        username: 'Shibu',
        password: hashedPassword,
        email: 'sibaprasadrout533@gmail.com'
      });
      console.log('Default admin seeded successfully.');
    }
  } catch (error) {
    console.error('Failed to seed admin user:', error.message);
  }
};

module.exports = {
  login,
  verifyToken,
  changePassword,
  seedAdmin
};
