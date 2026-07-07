const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getMessages,
  addMessage,
  markRead,
  archiveMessage,
  deleteMessage
} = require('../controllers/messageController');

router.route('/')
  .get(protect, getMessages)
  .post(addMessage);

router.route('/:id/read')
  .put(protect, markRead);

router.route('/:id/archive')
  .put(protect, archiveMessage);

router.route('/:id')
  .delete(protect, deleteMessage);

module.exports = router;
