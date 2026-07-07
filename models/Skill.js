const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'Cloud', 'DevOps', 'AI', 'Mobile', 'Tools', 'Other'],
    default: 'Frontend'
  },
  icon: { type: String, default: '' },
  color: { type: String, default: '#6366f1' },
  percentage: { type: Number, default: 80, min: 0, max: 100 },
  yearsExperience: { type: Number, default: 1 },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
