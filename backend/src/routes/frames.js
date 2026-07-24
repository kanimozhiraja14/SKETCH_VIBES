const express = require('express');
const router = express.Router();
const { getFrames, getAllFrames, createFrame, updateFrame, deleteFrame } = require('../controllers/frameController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, processUploads } = require('../middleware/upload');

router.get('/', getFrames);
router.get('/all', protect, adminOnly, getAllFrames);
router.post('/', protect, adminOnly, upload.single('image'), processUploads, createFrame);
router.put('/:id', protect, adminOnly, upload.single('image'), processUploads, updateFrame);
router.delete('/:id', protect, adminOnly, deleteFrame);

module.exports = router;
