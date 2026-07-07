const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  college: { type: String },
  university: { type: String },
  year: { type: String },
  percentage: { type: String },
  description: { type: String },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Education', EducationSchema);
