const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  const payload = { userId };
  const options = {
    expiresIn: process.env.JWT_EXPIRATION || '24h',
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error(`Token inválido o expirado: ${error.message}`);
  }
};

const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null;
  }
  return parts[1];
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
};
