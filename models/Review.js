const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, default: '' },
  company: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  message: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reply: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
