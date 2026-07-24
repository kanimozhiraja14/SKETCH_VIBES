const express = require('express');
const router = express.Router();
const { getServices, getAllServices, createService, updateService, deleteService } = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, processUploads } = require('../middleware/upload');

router.get('/', getServices);
router.get('/all', protect, adminOnly, getAllServices);
router.post('/', protect, adminOnly, upload.single('image'), processUploads, createService);
router.put('/:id', protect, adminOnly, upload.single('image'), processUploads, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
