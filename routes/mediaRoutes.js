const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadFile,
  getMedia,
  deleteMedia,
  renameMedia
} = require('../controllers/mediaController');

router.route('/')
  .get(protect, getMedia);

router.post('/upload', protect, upload.single('file'), uploadFile);

router.route('/:id')
  .delete(protect, deleteMedia);

router.put('/:id/rename', protect, renameMedia);

module.exports = router;
