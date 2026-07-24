const express = require('express');
const router = express.Router();
const { login, getMe, createAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/setup', createAdmin); // One-time setup only

module.exports = router;
