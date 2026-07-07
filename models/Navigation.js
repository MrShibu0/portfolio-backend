const mongoose = require('mongoose');

const NavigationSchema = new mongoose.Schema({
  label: { type: String, required: true },
  path: { type: String, required: true },
  active: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Navigation', NavigationSchema);
