require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const { errorHandler } = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const listRoutes = require('./routes/listRoutes');
const projectRoutes = require('./routes/projectRoutes');
const messageRoutes = require('./routes/messageRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Models for compatibility mappings
const Hero = require('./models/Hero');
const About = require('./models/About');
const Skill = require('./models/Skill');
const MajorProject = require('./models/MajorProject');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
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

  if (lastAtIndex === -1) return uri;

  const credentials = authority.slice(0, lastAtIndex);
  const host = authority.slice(lastAtIndex + 1);
  const colonIndex = credentials.indexOf(':');

  if (colonIndex === -1) return uri;

  const username = credentials.slice(0, colonIndex);
  const password = credentials.slice(colonIndex + 1);
  const encodedPassword = encodeURIComponent(decodeURIComponent(password));

  return `${uri.slice(0, credentialsStartIndex)}${username}:${encodedPassword}@${host}${uri.slice(authorityEndIndex)}`;
};

const MONGODB_URI = normalizeMongoUri(process.env.MONGODB_URI || DEFAULT_MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB via normalized connection");
    // Seed initial admin user
    await seedAdmin();
  })
  .catch(err => console.error("Could not connect to MongoDB", err));

// Global Midlewares
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Static directory for file uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/list', listRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/analytics', analyticsRoutes);

// Backward compatibility GET endpoint for visitor landing layout
app.get('/api/legacy/portfolio', async (req, res) => {
  try {
    const hero = await Hero.findOne() || {};
    const about = await About.findOne() || {};
    const skillsList = await Skill.find().sort({ displayOrder: 1 });
    const majorProjects = await MajorProject.find().sort({ displayOrder: 1 });

    res.json({
      name: hero.name || 'Shibu Prasad Rout',
      subtitle: hero.role || 'React Developer',
      pgTitle: about.pgTitle || '',
      pgDesc: about.pgDesc || '',
      ugTitle: about.ugTitle || '',
      ugDesc: about.ugDesc || '',
      profileImage: about.profileImage || '',
      skills: skillsList.map(s => ({ name: s.name, color: s.color })),
      projects: majorProjects.map(p => ({
        id: p.displayOrder || 1,
        title: p.title,
        desc: p.description,
        tech: p.technologies.join(', '),
        image: p.image,
        category: p.category,
        liveUrl: p.liveUrl,
        githubUrl: p.githubUrl
      }))
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Legacy POST compatibility
app.post('/api/legacy/portfolio', async (req, res) => {
  res.status(410).json({ message: 'Legacy unified endpoint deprecated. Use granular CMS forms.' });
});

// Global Error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
