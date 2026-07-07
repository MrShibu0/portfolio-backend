const mongoose = require('mongoose');

const SEOSchema = new mongoose.Schema({
  websiteTitle: { type: String, default: 'Portfolio' },
  metaDescription: { type: String, default: '' },
  keywords: [{ type: String }],
  ogImage: { type: String, default: '' },
  favicon: { type: String, default: '' },
  canonicalUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('SEO', SEOSchema);
