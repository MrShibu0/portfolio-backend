const mongoose = require('mongoose');

const CertificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  issuer: { type: String },
  date: { type: String },
  credentialUrl: { type: String },
  image: { type: String },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Certification', CertificationSchema);
