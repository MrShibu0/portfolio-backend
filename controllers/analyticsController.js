const fs = require('fs');
const path = require('path');
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
    const { path: routePath, device, browser } = req.body;
    
    // Create new analytics hit
    await Analytics.create({
      ip: req.ip,
      device: device || 'Desktop',
      browser: browser || 'Unknown',
      path: routePath || '/'
    });
    res.json({ success: true });
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

    // Charts 1: Visitor Growth (Grouped by Month/Year)
    // For simplicity, we can do a mongoose aggregation or JavaScript reduce
    const visitorLogs = await Analytics.find().select('createdAt');
    const visitorGrowth = {};
    visitorLogs.forEach(v => {
      const monthYear = v.createdAt.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      visitorGrowth[monthYear] = (visitorGrowth[monthYear] || 0) + 1;
    });
    const visitorChartData = Object.keys(visitorGrowth).map(key => ({
      name: key,
      value: visitorGrowth[key]
    })).slice(-6); // last 6 months

    // Charts 2: Project Categories
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

    // Charts 3: Skills Distribution
    const skills = await Skill.find().select('category');
    const skillsCategories = {};
    skills.forEach(s => {
      const cat = s.category || 'Other';
      skillsCategories[cat] = (skillsCategories[cat] || 0) + 1;
    });
    const skillsChartData = Object.keys(skillsCategories).map(key => ({
      name: key,
      value: skillsCategories[key]
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
        storageUsed,
        lastUpdated: lastUpdateDate,
        lastLogin
      },
      charts: {
        visitorGrowth: visitorChartData,
        projectCategories: projectCategoriesData,
        skillsDistribution: skillsChartData
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
