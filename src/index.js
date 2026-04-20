require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const User = require('./models/User');
const Item = require('./models/Item');
const authRoutes = require('./routes/authRoutes');
const itemsRoutes = require('./routes/itemsRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de prueba
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'API REST Backend funcionando correctamente',
    version: '1.0.0',
    endpoint: `http://localhost:${PORT}`,
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login',
      },
      items: {
        getAll: 'GET /api/items (requiere token)',
        getById: 'GET /api/items/:id (requiere token)',
        create: 'POST /api/items (requiere token)',
        update: 'PUT /api/items/:id (requiere token)',
        delete: 'DELETE /api/items/:id (requiere token)',
      },
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de items
app.use('/api/items', itemsRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    method: req.method,
    path: req.path,
  });
});

// Middleware de manejo de errores (debe estar al final)
app.use(errorHandler);

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    console.log('\n📡 Conectando a MySQL...');
    const connected = await testConnection();
    if (connected) {
      console.log('✓ Creando tablas...');
      await User.createTable();
      await Item.createTable();
      console.log('✓ Tablas inicializadas correctamente\n');
    }
  } catch (error) {
    console.error('✗ Error al inicializar base de datos:', error.message);
  }
};

// Servidor
const startServer = async () => {
  await initializeDatabase();

  app.listen(PORT, () => {
    console.log(`✓ Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(`✓ Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ API disponible en http://localhost:${PORT}/\n`);
  });
};

startServer();

module.exports = app;
