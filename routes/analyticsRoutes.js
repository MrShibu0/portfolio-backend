const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { logVisit, getDashboardAnalytics } = require('../controllers/analyticsController');

router.post('/hit', logVisit);
router.get('/dashboard', protect, getDashboardAnalytics);

module.exports = router;
