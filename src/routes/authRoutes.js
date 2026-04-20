const express = require('express');
const authController = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');

const router = express.Router();

// POST /auth/register - Registrar usuario
router.post('/register', validateRegister, authController.register);

// POST /auth/login - Login usuario
router.post('/login', validateLogin, authController.login);

module.exports = router;
