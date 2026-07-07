const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  aboutDescription: { type: String, default: '' },
  biography: { type: String, default: '' },
  profileImage: { type: String, default: '' },
  personalInfo: [{
    label: { type: String },
    value: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
