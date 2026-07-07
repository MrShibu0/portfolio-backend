const ContactMessage = require('../models/ContactMessage');
const SiteSetting = require('../models/SiteSetting');
const nodemailer = require('nodemailer');

// Helper to send email alerts on incoming contact form submissions
const sendMailAlert = async (name, email, messageText) => {
  try {
    const settings = await SiteSetting.findOne();
    if (!settings || !settings.emailSettings || !settings.emailSettings.smtpHost) {
      console.log('Skipping email alert: SMTP host not configured.');
      return;
    }

    const { smtpHost, smtpPort, smtpUser, smtpPass, receiveEmail } = settings.emailSettings;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: `"${name}" <${smtpUser}>`,
      to: receiveEmail || smtpUser,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${messageText}`,
      replyTo: email
    };

    await transporter.sendMail(mailOptions);
    console.log('Nodemailer alert sent successfully.');
  } catch (err) {
    console.error('Failed to send email alert:', err.message);
  }
};

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { search, filter } = req.query; // search keyword, filter = unread/archived/all
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ];
    }

    if (filter === 'unread') {
      query.read = false;
      query.archived = false;
    } else if (filter === 'archived') {
      query.archived = true;
    } else if (filter === 'inbox' || !filter) {
      query.archived = false;
    }

    const list = await ContactMessage.find(query).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

// @desc    Submit new message (Public)
// @route   POST /api/messages
// @access  Public
const addMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message fields are required.' });
    }

    const newMessage = await ContactMessage.create({
      name,
      email,
      subject: subject || '',
      message
    });

    // Fire email alert asynchronously so the API response isn't delayed
    sendMailAlert(name, email, message);

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message read/unread
// @route   PUT /api/messages/:id/read
// @access  Private
const markRead = async (req, res, next) => {
  try {
    const { read } = req.body;
    const item = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { read: read !== false },
      { new: true }
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Archive message
// @route   PUT /api/messages/:id/archive
// @access  Private
const archiveMessage = async (req, res, next) => {
  try {
    const { archived } = req.body;
    const item = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { archived: archived !== false },
      { new: true }
    );
    res.json(item);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res, next) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMessages,
  addMessage,
  markRead,
  archiveMessage,
  deleteMessage
};
