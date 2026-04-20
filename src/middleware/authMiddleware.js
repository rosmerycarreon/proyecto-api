const { verifyToken, extractTokenFromHeader } = require('../utils/tokenUtils');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: 'Token requerido',
        message: 'Debes incluir un token Bearer en el header Authorization',
      });
    }

    const decoded = verifyToken(token);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido',
      message: error.message,
    });
  }
};

module.exports = authMiddleware;
