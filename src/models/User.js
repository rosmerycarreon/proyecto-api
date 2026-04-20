const { pool } = require('../config/database');

const User = {
  // Crear tabla users si no existe
  createTable: async () => {
    try {
      const connection = await pool.getConnection();
      const sql = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await connection.query(sql);
      connection.release();
      console.log('✓ Tabla "users" verificada/creada');
    } catch (error) {
      console.error('✗ Error al crear tabla users:', error.message);
    }
  },

  // Obtener usuario por email
  findByEmail: async (email) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT id, email, password_hash FROM users WHERE email = ?',
        [email]
      );
      connection.release();
      return rows[0] || null;
    } catch (error) {
      console.error('Error en findByEmail:', error.message);
      throw error;
    }
  },

  // Obtener usuario por ID
  findById: async (id) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT id, email, created_at FROM users WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0] || null;
    } catch (error) {
      console.error('Error en findById:', error.message);
      throw error;
    }
  },

  // Crear nuevo usuario
  create: async (email, passwordHash) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [email, passwordHash]
      );
      connection.release();
      return { id: result.insertId, email };
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        const err = new Error('El email ya está registrado');
        err.code = 'DUPLICATE_EMAIL';
        throw err;
      }
      console.error('Error en create:', error.message);
      throw error;
    }
  },
};

module.exports = User;
