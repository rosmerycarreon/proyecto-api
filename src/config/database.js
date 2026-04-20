const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0,
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Conexión a MySQL establecida exitosamente');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Error al conectar a MySQL:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  testConnection,
  getConnection: () => pool.getConnection(),
};
