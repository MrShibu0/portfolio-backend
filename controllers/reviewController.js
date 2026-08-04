const Review = require('../models/Review');

// @desc    Submit a review (Public)
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res, next) => {
  try {
    const { name, email, company, rating, message } = req.body;
    
    if (!name || !rating || !message) {
      return res.status(400).json({ message: 'Name, rating, and message are required.' });
    }

    const review = await Review.create({
      name,
      email: email || '',
      company: company || '',
      rating: Number(rating),
      message,
      status: 'pending'
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Get approved reviews (Public)
// @route   GET /api/reviews
// @access  Public
const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for moderation (Private/Admin Only)
// @route   GET /api/reviews/admin
// @access  Private
const getAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

// @desc    Moderate a review (approve, reject, reply) (Private/Admin Only)
// @route   PUT /api/reviews/admin/:id
// @access  Private
const moderateReview = async (req, res, next) => {
  try {
    const { status, reply } = req.body;
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    if (status) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
      review.status = status;
    }

    if (reply !== undefined) {
      review.reply = reply;
    }

    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (Private/Admin Only)
// @route   DELETE /api/reviews/admin/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found.' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getApprovedReviews,
  getAdminReviews,
  moderateReview,
  deleteReview
};
