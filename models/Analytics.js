const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  ip: { type: String },
  country: { type: String, default: 'Unknown' },
  city: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Desktop' },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  path: { type: String, default: '/' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
