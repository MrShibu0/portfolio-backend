const mongoose = require('mongoose');

const MajorProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String },
  category: { type: String },
  description: { type: String },
  longDescription: { type: String },
  technologies: [{ type: String }],
  features: [{ type: String }],
  challenges: { type: String },
  solutions: { type: String },
  githubUrl: { type: String },
  liveUrl: { type: String },
  documentationUrl: { type: String },
  status: { type: String, default: 'Completed' },
  startDate: { type: String },
  endDate: { type: String },
  client: { type: String },
  teamSize: { type: Number, default: 1 },
  duration: { type: String },
  featured: { type: Boolean, default: false },
  displayOrder: { type: Number, default: 0 },
  image: { type: String },
  banner: { type: String },
  gallery: [{ type: String }],
  videoUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('MajorProject', MajorProjectSchema);
