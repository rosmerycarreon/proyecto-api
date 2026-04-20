const validateRegister = (req, res, next) => {
  const { email, password } = req.body;

  // Validar email
  if (!email || typeof email !== 'string') {
    return res.status(400).json({
      error: 'Email requerido',
      message: 'El email debe ser una cadena válida',
    });
  }

  if (!email.includes('@') || email.length < 5) {
    return res.status(400).json({
      error: 'Email inválido',
      message: 'El email debe ser válido y tener al menos 5 caracteres',
    });
  }

  // Validar contraseña
  if (!password || typeof password !== 'string') {
    return res.status(400).json({
      error: 'Contraseña requerida',
      message: 'La contraseña debe ser una cadena válida',
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      error: 'Contraseña débil',
      message: 'La contraseña debe tener al menos 6 caracteres',
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Credenciales incompletas',
      message: 'Email y contraseña son requeridos',
    });
  }

  next();
};

const validateItem = (req, res, next) => {
  const { nombre, descripcion, estado } = req.body;

  if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
    return res.status(400).json({
      error: 'Nombre requerido',
      message: 'El nombre debe ser una cadena no vacía',
    });
  }

  if (nombre.length > 100) {
    return res.status(400).json({
      error: 'Nombre demasiado largo',
      message: 'El nombre no debe exceder 100 caracteres',
    });
  }

  if (descripcion !== undefined && typeof descripcion !== 'string') {
    return res.status(400).json({
      error: 'Descripción inválida',
      message: 'La descripción debe ser una cadena',
    });
  }

  if (estado !== undefined && typeof estado !== 'boolean') {
    return res.status(400).json({
      error: 'Estado inválido',
      message: 'El estado debe ser un booleano (true/false)',
    });
  }

  next();
};

const validateItemUpdate = (req, res, next) => {
  const { nombre, descripcion, estado } = req.body;

  if (!nombre && descripcion === undefined && estado === undefined) {
    return res.status(400).json({
      error: 'Sin cambios',
      message: 'Debes proporcionar al menos un campo para actualizar',
    });
  }

  if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim() === '')) {
    return res.status(400).json({
      error: 'Nombre inválido',
      message: 'El nombre debe ser una cadena no vacía',
    });
  }

  if (nombre && nombre.length > 100) {
    return res.status(400).json({
      error: 'Nombre demasiado largo',
      message: 'El nombre no debe exceder 100 caracteres',
    });
  }

  if (estado !== undefined && typeof estado !== 'boolean') {
    return res.status(400).json({
      error: 'Estado inválido',
      message: 'El estado debe ser un booleano (true/false)',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateItem,
  validateItemUpdate,
};
