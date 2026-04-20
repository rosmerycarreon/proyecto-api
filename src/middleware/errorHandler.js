const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Errores de base de datos
  if (err.code === 'PROTOCOL_CONNECTION_LOST') {
    return res.status(503).json({
      error: 'Conexión perdida con la base de datos',
      message: 'El servidor de base de datos no está disponible',
    });
  }

  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
    return res.status(503).json({
      error: 'Error fatal en base de datos',
      message: 'Se ha perdido la conexión con la base de datos',
    });
  }

  if (err.code === 'PROTOCOL_ENQUEUE_AFTER_DESTROY') {
    return res.status(503).json({
      error: 'Conexión de base de datos cerrada',
      message: 'La conexión ha sido cerrada',
    });
  }

  // Errores específicos de aplicación
  if (err.code === 'DUPLICATE_EMAIL') {
    return res.status(409).json({
      error: 'Email duplicado',
      message: err.message,
    });
  }

  // Error genérico
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message || 'Ocurrió un error inesperado',
  });
};

module.exports = errorHandler;
