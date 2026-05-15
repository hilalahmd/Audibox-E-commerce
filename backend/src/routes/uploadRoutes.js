const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');
const { protect, requireRole } = require('../middleware/authMiddleware');

router.post('/', protect, requireRole('admin'), (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      const readableMessage =
        err?.message ||
        err?.error?.message ||
        "Image upload failed while processing file";
      console.error("upload route error:", err);
      return res.status(500).json({ message: readableMessage });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    if (!req.file.path) {
      return res.status(500).json({ message: "Upload succeeded but no image URL returned" });
    }

    return res.status(201).json({
      success: true,
      imageUrl: req.file.path,
      public_id: req.file.filename,
    });
  });
});

module.exports = router;
