const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getHero, updateHero,
  getAbout, updateAbout,
  getSEO, updateSEO,
  getTheme, updateTheme,
  getSettings, updateSettings,
  getNavigation, addNavigation, updateNavigation, deleteNavigation
} = require('../controllers/portfolioController');

// Hero routes
router.route('/hero').get(getHero).post(protect, updateHero);

// About routes
router.route('/about').get(getAbout).post(protect, updateAbout);

// SEO routes
router.route('/seo').get(getSEO).post(protect, updateSEO);

// Theme routes
router.route('/theme').get(getTheme).post(protect, updateTheme);

// Site settings routes
router.route('/settings').get(getSettings).post(protect, updateSettings);

// Navigation routes
router.route('/navigation')
  .get(getNavigation)
  .post(protect, addNavigation);

router.route('/navigation/:id')
  .put(protect, updateNavigation)
  .delete(protect, deleteNavigation);

module.exports = router;
