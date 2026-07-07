const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String },
  folder: {
    type: String,
    enum: ['profile', 'projects', 'gallery', 'certificates', 'media'],
    default: 'media'
  },
  mimeType: { type: String },
  size: { type: Number },
  url: { type: String, required: true },
  altText: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Media', MediaSchema);
