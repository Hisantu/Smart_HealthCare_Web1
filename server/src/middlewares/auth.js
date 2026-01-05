// server/src/middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secret = process.env.JWT_SECRET || 'change_this_secret';

async function auth(req, res, next) {
  const header = req.headers.authorization;
  if(!header) return res.status(401).json({ ok:false, message: 'Missing authorization' });
  const token = header.split(' ')[1];
  if(!token) return res.status(401).json({ ok:false, message: 'Invalid authorization' });

  try {
    const payload = jwt.verify(token, secret);
    const user = await User.findById(payload.userId).select('-passwordHash');
    if(!user) return res.status(401).json({ ok:false, message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ok:false, message: 'Token invalid', error: err.message });
  }
}

module.exports = auth;
