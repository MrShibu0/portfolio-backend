const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure base upload directory exists
const uploadBaseDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadBaseDir)) {
  fs.mkdirSync(uploadBaseDir, { recursive: true });
}

// Subfolder list
const subFolders = ['profile', 'projects', 'gallery', 'certificates', 'media'];
subFolders.forEach(sub => {
  const dir = path.join(uploadBaseDir, sub);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Read folder parameter from query string or body fields (default to 'media')
    let folder = req.query.folder || req.body.folder || 'media';
    if (!subFolders.includes(folder)) {
      folder = 'media';
    }
    const destPath = path.join(__dirname, '../uploads', folder);
    cb(null, destPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  // Allow images, audios, videos, documents (pdf/doc/txt)
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg|mp4|webm|pdf|doc|docx|txt|zip/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File upload rejected: Unsupported file extension type.'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max file size
});

module.exports = upload;
