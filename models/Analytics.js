const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  ip: { type: String },
  country: { type: String, default: 'Unknown' },
  device: { type: String },
  browser: { type: String },
  path: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', AnalyticsSchema);
