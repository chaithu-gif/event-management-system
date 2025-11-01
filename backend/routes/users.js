const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get logged-in user info
router.get('/me', auth, (req, res) => res.json(req.user));

module.exports = router;
