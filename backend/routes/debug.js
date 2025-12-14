const express = require('express');
const router = express.Router();

// Simple debug endpoint to verify admin secret header handling.
// Returns {ok:true} when provided header matches server config, otherwise 401.
router.get('/admin-check', (req, res) => {
  try {
    const adminSecret = req.header('x-admin-secret') || req.query.adminSecret || '';
    const CONFIG_ADMIN_SECRET = process.env.ADMIN_SECRET || 'event$phere2025';
    if (adminSecret && adminSecret === CONFIG_ADMIN_SECRET) return res.json({ ok: true });
    return res.status(401).json({ ok: false, msg: 'admin-secret did not match' });
  } catch (e) {
    console.warn('Debug admin-check error', e && e.message);
    return res.status(500).json({ ok: false, msg: 'server error' });
  }
});

module.exports = router;
