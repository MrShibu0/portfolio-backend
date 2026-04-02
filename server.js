const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer'); // <-- Added Nodemailer

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); 

// Connect to MongoDB 
mongoose.connect('mongodb+srv://shiburout:Shibu@0852@cluster0.4zsh6x9.mongodb.net/?appName=Cluster0')
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
    let data = await Portfolio.findOne();
    if (!data) data = { name: "Your Name", subtitle: "Developer", skills: [], projects: [] };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Save/Update portfolio data
app.post('/api/portfolio', async (req, res) => {
  try {
    await Portfolio.deleteMany({});
    const newPortfolio = new Portfolio(req.body);
    await newPortfolio.save();
    res.json({ message: "Portfolio saved successfully!" });
  } catch (error) {
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

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));