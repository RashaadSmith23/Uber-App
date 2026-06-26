const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'fallback-secret';

exports.signToken = (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secret);
};

exports.signToken = (userId, role) => {
  return jwt.sign({ userId, role }, secret, { expiresIn: '7d' });
};