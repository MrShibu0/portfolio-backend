const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  createReview,
  getApprovedReviews,
  getAdminReviews,
  moderateReview,
  deleteReview
} = require('../controllers/reviewController');

// Public endpoints
router.post('/', createReview);
router.get('/', getApprovedReviews);

// Protected admin endpoints
router.get('/admin', protect, getAdminReviews);
router.put('/admin/:id', protect, moderateReview);
router.delete('/admin/:id', protect, deleteReview);

module.exports = router;
