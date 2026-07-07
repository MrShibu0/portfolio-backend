const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  primaryColor: { type: String, default: '#6366f1' },
  secondaryColor: { type: String, default: '#0f172a' },
  accentColor: { type: String, default: '#06b6d4' },
  glassBlur: { type: String, default: '16px' },
  borderRadius: { type: String, default: '1rem' },
  font: { type: String, default: 'Inter' },
  animationSpeed: { type: String, default: 'normal' },
  darkTheme: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Theme', ThemeSchema);
