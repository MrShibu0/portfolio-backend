const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer'); // <-- Added Nodemailer

const app = express();
const PORT = process.env.PORT || 5000;
const DEFAULT_MONGODB_URI = 'mongodb+srv://shiburout:Shibu%400852@cluster0.4zsh6x9.mongodb.net/?appName=Cluster0';

const normalizeMongoUri = (uri) => {
  if (!uri || !uri.startsWith('mongodb')) {
    return DEFAULT_MONGODB_URI;
  }

  const protocolSeparatorIndex = uri.indexOf('://');
  const credentialsStartIndex = protocolSeparatorIndex + 3;
  const firstSlashIndex = uri.indexOf('/', credentialsStartIndex);
  const authorityEndIndex = firstSlashIndex === -1 ? uri.length : firstSlashIndex;
  const authority = uri.slice(credentialsStartIndex, authorityEndIndex);
  const lastAtIndex = authority.lastIndexOf('@');

  if (lastAtIndex === -1) {
    return uri;
  }

  const credentials = authority.slice(0, lastAtIndex);
  const host = authority.slice(lastAtIndex + 1);
  const colonIndex = credentials.indexOf(':');

  if (colonIndex === -1) {
    return uri;
  }

  const username = credentials.slice(0, colonIndex);
  const password = credentials.slice(colonIndex + 1);
  const encodedPassword = encodeURIComponent(decodeURIComponent(password));

  return `${uri.slice(0, credentialsStartIndex)}${username}:${encodedPassword}@${host}${uri.slice(authorityEndIndex)}`;
};

const MONGODB_URI = normalizeMongoUri(process.env.MONGODB_URI || DEFAULT_MONGODB_URI);
const EMPTY_PORTFOLIO = { name: 'Your Name', subtitle: 'Developer', skills: [], projects: [] };

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// Connect to MongoDB 
mongoose.connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB", err));

// Schema
const portfolioSchema = new mongoose.Schema({
  name: String, subtitle: String, pgTitle: String, pgDesc: String, ugTitle: String, ugDesc: String, profileImage: String,
  skills: [{ name: String, color: String }],
  projects: [{ id: Number, title: String, desc: String, tech: String, image: String }]
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema);

// --- ROUTES ---

// Get portfolio data
app.get('/api/portfolio', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json(EMPTY_PORTFOLIO);
    }

    let data = await Portfolio.findOne();
    if (!data) data = EMPTY_PORTFOLIO;
    res.json(data);
  } catch (error) {
    console.error('Portfolio fetch failed:', error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Save/Update portfolio data
app.post('/api/portfolio', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not connected yet. Please try again in a few seconds.' });
    }

    await Portfolio.findOneAndUpdate({}, req.body, {
      new: true,
      overwrite: true,
      upsert: true
    });
    res.json({ message: "Portfolio saved successfully!" });
  } catch (error) {
    console.error('Portfolio save failed:', error);
    res.status(500).json({ error: "Failed to save data" });
  }
});

// NEW ROUTE: Send Email
app.post('/api/contact', async (req, res) => {
  const { user_name, user_email, message } = req.body;

  // 1. Configure the email sender
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sibaprasadrout533@gmail.com', // <-- Put your Gmail here
      pass: 'wlqb yhgt zrba sdyi'    // <-- Paste your App Password here (no spaces)
    }
  });

  // 2. Format the email
  const mailOptions = {
    from: user_email,
    to: 'sibaprasadrout533@gmail.com',     // <-- Where you want to receive the emails
    subject: `New Portfolio Message from ${user_name}`,
    text: `You have a new message from your portfolio website!\n\nName: ${user_name}\nEmail: ${user_email}\nMessage:\n${message}`
  };

  // 3. Send it
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
