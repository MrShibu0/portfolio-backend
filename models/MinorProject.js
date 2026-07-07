const mongoose = require('mongoose');

const MinorProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  technologies: [{ type: String }],
  githubUrl: { type: String },
  liveUrl: { type: String },
  thumbnail: { type: String },
  status: { type: String, default: 'Completed' },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('MinorProject', MinorProjectSchema);
