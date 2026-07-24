const express = require('express');
const router = express.Router();
const { createContact, getContacts, markRead } = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', createContact);
router.get('/', protect, adminOnly, getContacts);
router.put('/:id/read', protect, adminOnly, markRead);

module.exports = router;
