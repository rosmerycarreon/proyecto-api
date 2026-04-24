const mysql = require('mysql2/promise');
const fs = require('fs');

// DATOS DIRECTOS DE AIVEN
const DB_CONFIG = {
    host: 'api-backend-senati-a855.i.aivencloud.com',
    port: 11367,
    user: 'avnadmin',
    password: process.env.DB_PASSWORD,
    database: 'defaultdb',
    ssl: {
        ca: fs.readFileSync('./ca.pem'),
        rejectUnauthorized: false   // ← ESTA LÍNEA SOLUCIONA EL ERROR
    }
};

const pool = mysql.createPool(DB_CONFIG);

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conectado a MySQL (Aiven) correctamente');
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
                id INT PRIMARY KEY AUTO_INCREMENT,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                estado BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tablas creadas/verificadas correctamente');
        connection.release();
    } catch (error) {
        console.error('❌ Error al inicializar tablas:', error.message);
    }
};

module.exports = {
    pool,
    testConnection,
    initializeDatabase,
    getConnection: () => pool.getConnection()
};