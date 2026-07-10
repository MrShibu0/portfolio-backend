const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow images, audios, videos, documents (pdf/doc/txt)
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg|mp4|webm|pdf|doc|docx|txt|zip/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(file.originalname.split('.').pop().toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('File upload rejected: Unsupported file extension type.'));
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB max file size (fits within MongoDB's 16MB document limit)
});

module.exports = upload;
