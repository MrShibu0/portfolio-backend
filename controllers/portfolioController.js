const Hero = require('../models/Hero');
const About = require('../models/About');
const SEO = require('../models/SEO');
const Theme = require('../models/Theme');
const SiteSetting = require('../models/SiteSetting');
const Navigation = require('../models/Navigation');
const ActivityLog = require('../models/ActivityLog');

// Helper to log admin actions
const logAction = async (username, action, details) => {
  try {
    await ActivityLog.create({ username, action, details });
  } catch (err) {
    console.error('Failed to write activity log:', err.message);
  }
};

// --- HERO CONTROLLERS ---
const getHero = async (req, res, next) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      hero = await Hero.create({});
    }
    res.json(hero);
  } catch (error) {
    next(error);
  }
};

const updateHero = async (req, res, next) => {
  try {
    const hero = await Hero.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logAction(req.user.username, 'UPDATE_HERO', 'Hero section updated.');
    res.json(hero);
  } catch (error) {
    next(error);
  }
};

// --- ABOUT CONTROLLERS ---
const getAbout = async (req, res, next) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = await About.create({});
    }
    res.json(about);
  } catch (error) {
    next(error);
  }
};

const updateAbout = async (req, res, next) => {
  try {
    const about = await About.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logAction(req.user.username, 'UPDATE_ABOUT', 'About section updated.');
    res.json(about);
  } catch (error) {
    next(error);
  }
};

// --- SEO CONTROLLERS ---
const getSEO = async (req, res, next) => {
  try {
    let seo = await SEO.findOne();
    if (!seo) {
      seo = await SEO.create({});
    }
    res.json(seo);
  } catch (error) {
    next(error);
  }
};

const updateSEO = async (req, res, next) => {
  try {
    const seo = await SEO.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logAction(req.user.username, 'UPDATE_SEO', 'SEO configuration updated.');
    res.json(seo);
  } catch (error) {
    next(error);
  }
};

// --- THEME CONTROLLERS ---
const getTheme = async (req, res, next) => {
  try {
    let theme = await Theme.findOne();
    if (!theme) {
      theme = await Theme.create({});
    }
    res.json(theme);
  } catch (error) {
    next(error);
  }
};

const updateTheme = async (req, res, next) => {
  try {
    const theme = await Theme.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logAction(req.user.username, 'UPDATE_THEME', 'Theme & appearance config updated.');
    res.json(theme);
  } catch (error) {
    next(error);
  }
};

// --- SITE SETTINGS CONTROLLERS ---
const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSetting.findOne();
    if (!settings) {
      settings = await SiteSetting.create({});
    }
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settings = await SiteSetting.findOneAndUpdate({}, req.body, { upsert: true, new: true });
    await logAction(req.user.username, 'UPDATE_SETTINGS', 'General site settings updated.');
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

// --- NAVIGATION CONTROLLERS ---
const getNavigation = async (req, res, next) => {
  try {
    const list = await Navigation.find().sort({ displayOrder: 1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

const addNavigation = async (req, res, next) => {
  try {
    const item = await Navigation.create(req.body);
    await logAction(req.user.username, 'ADD_NAVIGATION', `Added navigation link: ${item.label}`);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

const updateNavigation = async (req, res, next) => {
  try {
    const item = await Navigation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(item);
  } catch (error) {
    next(error);
  }
};

const deleteNavigation = async (req, res, next) => {
  try {
    const item = await Navigation.findByIdAndDelete(req.params.id);
    if (item) {
      await logAction(req.user.username, 'DELETE_NAVIGATION', `Deleted navigation link: ${item.label}`);
    }
    res.json({ message: 'Navigation link removed.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHero, updateHero,
  getAbout, updateAbout,
  getSEO, updateSEO,
  getTheme, updateTheme,
  getSettings, updateSettings,
  getNavigation, addNavigation, updateNavigation, deleteNavigation
};
