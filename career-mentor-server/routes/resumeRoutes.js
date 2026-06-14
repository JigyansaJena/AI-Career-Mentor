const express = require('express');
const router = express.Router();
const multer = require('multer');
const { uploadResume, getResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    file.mimetype === 'application/pdf' ? cb(null, true) : cb(new Error('PDF only'), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/', protect, getResume);
module.exports = router;