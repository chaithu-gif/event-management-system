const jwt = require('jsonwebtoken');

// Express middleware to verify JWT from Authorization header or x-auth-token
module.exports = function (req, res, next) {
  try {
    console.log('\n[AUTH DEBUG] ========================================');
    console.log('[AUTH DEBUG] Request:', req.method, req.path);
    console.log('[AUTH DEBUG] All headers:', JSON.stringify(req.headers, null, 2));
    
    // 1) Accept Bearer token or x-auth-token as JWT for regular users
    const authHeader = req.header('authorization') || req.header('Authorization') || '';
    let token = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1].trim();
    } else if (req.header('x-auth-token')) {
      token = req.header('x-auth-token');
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (token) {
      if (!JWT_SECRET) return res.status(500).json({ msg: 'Server misconfiguration' });
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { _id: decoded.id };
      console.log('[AUTH DEBUG] JWT token verified. Access granted.');
      return next();
    }

    // 2) Fallback: allow admin via a shared secret header `x-admin-secret` (case-insensitive)
    const adminSecret = req.headers['x-admin-secret'] || req.query.adminSecret || '';
    const CONFIG_ADMIN_SECRET = process.env.ADMIN_SECRET || 'event$phere2025';
    console.log('[AUTH DEBUG] CONFIG_ADMIN_SECRET:', CONFIG_ADMIN_SECRET);
    console.log('[AUTH DEBUG] adminSecret from header/query:', adminSecret);
    
    if (adminSecret) {
      console.log('[AUTH DEBUG] Secret provided. Comparing...');
      if (adminSecret === CONFIG_ADMIN_SECRET) {
        console.log('[AUTH DEBUG] ✓ MATCH! Admin secret accepted.');
        req.user = { _id: null, role: 'admin' };
        console.log('[AUTH DEBUG] ========================================\n');
        return next();
      }
      console.log('[AUTH DEBUG] ✗ MISMATCH! Secret does not match.');
    }

    console.log('[AUTH DEBUG] No valid token or admin secret. Denying access.');
    console.log('[AUTH DEBUG] ========================================\n');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  } catch (err) {
    console.warn('[AUTH ERROR]', err && err.message);
    console.log('[AUTH DEBUG] ========================================\n');
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};
