const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/tokenUtils');

const authController = {
  register: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Verificar si el usuario ya existe
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          error: 'Usuario ya existe',
          message: 'El email ya está registrado en el sistema',
        });
      }

      // Hash de la contraseña
      const salt = await bcryptjs.genSalt(10);
      const passwordHash = await bcryptjs.hash(password, salt);

      // Crear usuario
      const newUser = await User.create(email, passwordHash);

      // Generar token
      const token = generateToken(newUser.id);

      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user: {
          id: newUser.id,
          email: newUser.email,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario por email
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos',
        });
      }

      // Verificar contraseña
      const isPasswordValid = await bcryptjs.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Credenciales inválidas',
          message: 'Email o contraseña incorrectos',
        });
      }

      // Generar token
      const token = generateToken(user.id);

      res.status(200).json({
        message: 'Login exitoso',
        user: {
          id: user.id,
          email: user.email,
        },
        token,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
