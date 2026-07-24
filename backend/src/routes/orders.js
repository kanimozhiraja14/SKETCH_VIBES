const express = require('express');
const router = express.Router();
const { createOrder, getOrders, updateOrder } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');
const { upload, processUploads } = require('../middleware/upload');

router.post('/', upload.array('referenceImages', 5), processUploads, createOrder);
router.get('/', protect, adminOnly, getOrders);
router.put('/:id', protect, adminOnly, updateOrder);

module.exports = router;
