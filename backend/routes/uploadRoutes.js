const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Format the path for web access
  const filePath = req.file.path.replace(/\\/g, "/");
  res.json({
    message: 'File uploaded successfully',
    url: `/${filePath}`
  });
});

module.exports = router;
