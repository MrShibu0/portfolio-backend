const fs = require('fs');
const path = require('path');
const Media = require('../models/Media');
const ActivityLog = require('../models/ActivityLog');

const logAction = async (username, action, details) => {
  try {
    await ActivityLog.create({ username, action, details });
  } catch (err) {
    console.error('Failed logging media action:', err.message);
  }
};

// @desc    Upload resource file
// @route   POST /api/media/upload
// @access  Private
const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const folder = req.query.folder || req.body.folder || 'media';
    
    // Convert req.file buffer to base64 data URI
    const base64Data = req.file.buffer.toString('base64');
    const dataUri = `data:${req.file.mimetype};base64,${base64Data}`;
    const uniqueFilename = `file-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

    const media = await Media.create({
      filename: uniqueFilename,
      originalName: req.file.originalname,
      folder: folder,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: dataUri
    });

    await logAction(req.user.username, 'UPLOAD_MEDIA', `Uploaded file: ${media.originalName} to folder ${media.folder}`);

    res.status(201).json(media);
  } catch (error) {
    next(error);
  }
};

// @desc    Get files list
// @route   GET /api/media
// @access  Private
const getMedia = async (req, res, next) => {
  try {
    const { folder, search } = req.query;
    let query = {};

    if (folder && folder !== 'all') {
      query.folder = folder;
    }
    if (search) {
      query.originalName = { $regex: search, $options: 'i' };
    }

    const list = await Media.find(query).sort({ createdAt: -1 });
    res.json(list);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete media file
// @route   DELETE /api/media/:id
// @access  Private
const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media record not found.' });
    }

    // Resolve local file path
    const localPath = path.join(__dirname, '../uploads', media.folder, media.filename);

    // Delete from disk
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
    }

    await Media.findByIdAndDelete(req.params.id);
    await logAction(req.user.username, 'DELETE_MEDIA', `Deleted file: ${media.originalName} from folder ${media.folder}`);

    res.json({ message: 'Media file removed successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Rename media title
// @route   PUT /api/media/:id/rename
// @access  Private
const renameMedia = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name parameter is required.' });
    }

    const media = await Media.findById(req.params.id);
    if (!media) {
      return res.status(404).json({ message: 'Media record not found.' });
    }

    const oldName = media.originalName;
    media.originalName = name;
    await media.save();

    await logAction(req.user.username, 'RENAME_MEDIA', `Renamed file: ${oldName} to ${name}`);

    res.json(media);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadFile,
  getMedia,
  deleteMedia,
  renameMedia
};
