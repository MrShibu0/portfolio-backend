const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const Analytics = require('../models/Analytics');
const Skill = require('../models/Skill');
const MajorProject = require('../models/MajorProject');
const MinorProject = require('../models/MinorProject');
const ContactMessage = require('../models/ContactMessage');
const Certification = require('../models/Certification');
const ActivityLog = require('../models/ActivityLog');

// Helper to recursively get storage folder size
const getFolderSize = (dirPath) => {
  let size = 0;
  if (!fs.existsSync(dirPath)) return 0;
  
  const files = fs.readdirSync(dirPath);
  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i]);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      size += getFolderSize(filePath);
    } else {
      size += stats.size;
    }
  }
  return size;
};

// @desc    Log a visitor hit (Public)
// @route   POST /api/analytics/hit
// @access  Public
const logVisit = async (req, res, next) => {
  try {
    const { path: routePath, device, browser, os } = req.body;
    
    // Extract real IP behind proxies (Render, Nginx)
    const rawIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    let ip = rawIp.includes(',') ? rawIp.split(',')[0].trim() : rawIp;
    
    // Hash IP address to protect privacy (SHA-256 substring)
    const hashedIp = crypto.createHash('sha256').update(ip || 'unknown').digest('hex').substring(0, 16);
    
    // Create baseline entry
    const analyticsEntry = new Analytics({
      ip: hashedIp,
      device: device || 'Desktop',
      browser: browser || 'Unknown',
      os: os || 'Unknown',
      path: routePath || '/'
    });

    // Respond immediately to prevent page-load blocking
    res.json({ success: true });

    // Asynchronous background GeoIP lookup & save
    (async () => {
      try {
        if (ip && ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('10.') && !ip.startsWith('192.168.')) {
          const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.status === 'success') {
              analyticsEntry.country = geoData.country || 'Unknown';
              analyticsEntry.city = geoData.city || 'Unknown';
            }
          }
        } else {
          // Fallback for localhost testing
          analyticsEntry.country = 'India';
          analyticsEntry.city = 'Bhubaneswar';
        }
      } catch (err) {
        console.error('GeoIP lookup error:', err.message);
      } finally {
        await analyticsEntry.save();
      }
    })();
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard dashboard statistics & chart summaries (Private)
// @route   GET /api/analytics/dashboard
// @access  Private
const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalSkills = await Skill.countDocuments();
    const majorCount = await MajorProject.countDocuments();
    const minorCount = await MinorProject.countDocuments();
    const certCount = await Certification.countDocuments();
    const unreadMessages = await ContactMessage.countDocuments({ read: false, archived: false });
    const totalVisitors = await Analytics.countDocuments();

    // Time boundary calculations
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

    const todayVisitors = await Analytics.countDocuments({ createdAt: { $gte: todayStart } });
    const weekVisitors = await Analytics.countDocuments({ createdAt: { $gte: weekStart } });
    const monthVisitors = await Analytics.countDocuments({ createdAt: { $gte: monthStart } });

    // Unique Visitors (distinct IP hashes)
    const uniqueIps = await Analytics.distinct('ip');
    const uniqueVisitors = uniqueIps.length;

    // Returning Visitors: count of IP hashes with > 1 visits
    const returningAggregate = await Analytics.aggregate([
      { $group: { _id: '$ip', count: { $sum: 1 } } },
      { $match: { count: { $gt: 1 } } },
      { $count: 'count' }
    ]);
    const returningVisitors = returningAggregate.length > 0 ? returningAggregate[0].count : 0;

    // Top Countries (aggregates)
    const topCountriesAggregate = await Analytics.aggregate([
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const topCountries = topCountriesAggregate.map(item => ({
      name: item._id || 'Unknown',
      value: item.count
    }));

    // Most Viewed Pages (aggregates)
    const topPagesAggregate = await Analytics.aggregate([
      { $group: { _id: '$path', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const topPages = topPagesAggregate.map(item => ({
      name: item._id || '/',
      value: item.count
    }));

    // Device Types (aggregates)
    const deviceAggregate = await Analytics.aggregate([
      { $group: { _id: '$device', count: { $sum: 1 } } }
    ]);
    const deviceStats = deviceAggregate.map(item => ({
      name: item._id || 'Desktop',
      value: item.count
    }));

    // Browser Statistics (aggregates)
    const browserAggregate = await Analytics.aggregate([
      { $group: { _id: '$browser', count: { $sum: 1 } } }
    ]);
    const browserStats = browserAggregate.map(item => ({
      name: item._id || 'Unknown',
      value: item.count
    }));

    // OS Statistics (aggregates)
    const osAggregate = await Analytics.aggregate([
      { $group: { _id: '$os', count: { $sum: 1 } } }
    ]);
    const osStats = osAggregate.map(item => ({
      name: item._id || 'Unknown',
      value: item.count
    }));

    // Daily visitor chart (last 7 days)
    const dailyVisitorChart = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(todayStart.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEnd = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      const count = await Analytics.countDocuments({
        createdAt: { $gte: d, $lt: dayEnd }
      });
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      dailyVisitorChart.push({ name: dayLabel, value: count });
    }

    // Storage Used
    const uploadsDir = path.join(__dirname, '../uploads');
    const bytesUsed = getFolderSize(uploadsDir);
    const storageUsed = `${(bytesUsed / (1024 * 1024)).toFixed(2)} MB`;

    // Last Update: find newest updatedAt date across models
    const tables = [Skill, MajorProject, MinorProject, Certification];
    let lastUpdateDate = new Date();
    const updates = await Promise.all(tables.map(t => t.findOne().sort({ updatedAt: -1 })));
    const validUpdates = updates.filter(Boolean).map(doc => doc.updatedAt);
    if (validUpdates.length > 0) {
      lastUpdateDate = new Date(Math.max(...validUpdates.map(d => d.getTime())));
    }

    // Last Login
    const lastLoginLog = await ActivityLog.findOne({ action: 'LOGIN' }).sort({ createdAt: -1 });
    const lastLogin = lastLoginLog ? lastLoginLog.createdAt : null;

    // Project Categories
    const majorProjs = await MajorProject.find().select('category');
    const projectCategories = {};
    majorProjs.forEach(p => {
      const cat = p.category || 'Other';
      projectCategories[cat] = (projectCategories[cat] || 0) + 1;
    });
    const projectCategoriesData = Object.keys(projectCategories).map(key => ({
      name: key,
      value: projectCategories[key]
    }));

    // Audit Logs (last 20 logs)
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(20);

    res.json({
      metrics: {
        totalSkills,
        majorProjects: majorCount,
        minorProjects: minorCount,
        certifications: certCount,
        unreadMessages,
        totalVisitors,
        todayVisitors,
        weekVisitors,
        monthVisitors,
        uniqueVisitors,
        returningVisitors,
        storageUsed,
        lastUpdated: lastUpdateDate,
        lastLogin
      },
      charts: {
        dailyVisitors: dailyVisitorChart,
        topCountries,
        topPages,
        deviceStats,
        browserStats,
        osStats,
        projectCategories: projectCategoriesData
      },
      activityLogs: logs
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  logVisit,
  getDashboardAnalytics
};
