const mysql = require('mysql2/promise');
const fs = require('fs');

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'backend_api';
const DB_SSL = process.env.DB_SSL === 'true';
const DB_SSL_CA = process.env.DB_SSL_CA;
const DB_SSL_REJECT_UNAUTHORIZED = process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false';

const dbConfig = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

if (DB_SSL) {
  dbConfig.ssl = {
    rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED,
  };

  if (DB_SSL_CA) {
    try {
      dbConfig.ssl.ca = fs.readFileSync(DB_SSL_CA);
    } catch (error) {
      console.error('❌ Error al leer DB_SSL_CA:', error.message);
      throw error;
    }
  }
}

const pool = mysql.createPool(dbConfig);

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(`✅ Conectado a MySQL correctamente: ${DB_HOST}:${DB_PORT}/${DB_NAME}`);
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
};

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        descripcion TEXT,
        estado BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla "items" verificada/creada correctamente');
    connection.release();
  } catch (error) {
    console.error('❌ Error al inicializar tablas:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  getConnection: () => pool.getConnection(),
};