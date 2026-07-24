const express = require('express');
const router = express.Router();
const { getGallery, createGallery, updateGallery, deleteGallery } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, processUploads } = require('../middleware/upload');

router.get('/', getGallery);
router.post('/', protect, adminOnly, upload.single('image'), processUploads, createGallery);
router.put('/:id', protect, adminOnly, upload.single('image'), processUploads, updateGallery);
router.delete('/:id', protect, adminOnly, deleteGallery);

module.exports = router;
