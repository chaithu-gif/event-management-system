const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post('/admin-login', [
  body('email').isEmail().withMessage("Valid email required"),
  body('password').notEmpty().withMessage("Password required")
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ msg: errors.array()[0].msg });
    
    const { email, password } = req.body;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@eventsphere.com';
    const ADMIN_PASSWORD_RAW = process.env.ADMIN_PASSWORD || 'admin123';
    
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD_RAW) {
      return res.status(401).json({ msg: 'Invalid admin credentials' });
    }
    
    const token = jwt.sign({ id: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: 'admin', email: ADMIN_EMAIL, role: 'admin', name: 'Administrator' } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
