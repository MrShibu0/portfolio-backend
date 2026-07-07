const mongoose = require('mongoose');

const SiteSettingSchema = new mongoose.Schema({
  siteName: { type: String, default: 'Developer Portfolio' },
  footerCopyright: { type: String, default: '© 2026 All Rights Reserved' },
  googleAnalyticsId: { type: String, default: '' },
  googleSearchConsoleId: { type: String, default: '' },
  robotsTxt: { type: String, default: 'User-agent: *\nDisallow:' },
  sitemapUrl: { type: String, default: '' },
  emailSettings: {
    smtpHost: { type: String, default: '' },
    smtpPort: { type: Number, default: 587 },
    smtpUser: { type: String, default: '' },
    smtpPass: { type: String, default: '' },
    receiveEmail: { type: String, default: '' }
  }
}, { timestamps: true });

module.exports = mongoose.model('SiteSetting', SiteSettingSchema);
