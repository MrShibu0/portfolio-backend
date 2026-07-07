const mongoose = require('mongoose');

const HeroSchema = new mongoose.Schema({
  name: { type: String, default: 'Shibu Prasad Rout' },
  role: { type: String, default: 'React Developer' },
  intro: { type: String, default: 'Crafting sophisticated frontend interfaces and dynamic full stack applications.' },
  resumeUrl: { type: String, default: '' },
  githubUrl: { type: String, default: 'https://github.com' },
  linkedinUrl: { type: String, default: 'https://linkedin.com' },
  twitterUrl: { type: String, default: '' },
  instagramUrl: { type: String, default: '' },
  facebookUrl: { type: String, default: '' },
  backgroundUrl: { type: String, default: '' },
  heroImageUrl: { type: String, default: '' },
  stats: [{
    label: { type: String },
    value: { type: String }
  }],
  typewriterText: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Hero', HeroSchema);
