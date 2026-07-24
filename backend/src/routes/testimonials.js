const express = require('express');
const router = express.Router();
const { getTestimonials, getAllTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, processUploads } = require('../middleware/upload');

router.get('/', getTestimonials);
router.get('/all', protect, adminOnly, getAllTestimonials);
router.post('/', upload.single('profilePhoto'), processUploads, createTestimonial);
router.put('/:id', protect, adminOnly, updateTestimonial);
router.delete('/:id', protect, adminOnly, deleteTestimonial);

module.exports = router;
