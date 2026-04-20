const { pool } = require('../config/database');

const Item = {
  // Crear tabla items si no existe
  createTable: async () => {
    try {
      const connection = await pool.getConnection();
      const sql = `
        CREATE TABLE IF NOT EXISTS items (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          descripcion TEXT,
          estado BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await connection.query(sql);
      connection.release();
      console.log('✓ Tabla "items" verificada/creada');
    } catch (error) {
      console.error('✗ Error al crear tabla items:', error.message);
    }
  },

  // Obtener todos los items
  getAll: async () => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT id, nombre, descripcion, estado, created_at FROM items ORDER BY created_at DESC'
      );
      connection.release();
      return rows;
    } catch (error) {
      console.error('Error en getAll:', error.message);
      throw error;
    }
  },

  // Obtener item por ID
  getById: async (id) => {
    try {
      const connection = await pool.getConnection();
      const [rows] = await connection.query(
        'SELECT id, nombre, descripcion, estado, created_at FROM items WHERE id = ?',
        [id]
      );
      connection.release();
      return rows[0] || null;
    } catch (error) {
      console.error('Error en getById:', error.message);
      throw error;
    }
  },

  // Crear nuevo item
  create: async (nombre, descripcion, estado = true) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'INSERT INTO items (nombre, descripcion, estado) VALUES (?, ?, ?)',
        [nombre, descripcion, estado]
      );
      connection.release();
      return { id: result.insertId, nombre, descripcion, estado };
    } catch (error) {
      console.error('Error en create:', error.message);
      throw error;
    }
  },

  // Actualizar item
  update: async (id, nombre, descripcion, estado) => {
    try {
      const connection = await pool.getConnection();
      await connection.query(
        'UPDATE items SET nombre = ?, descripcion = ?, estado = ? WHERE id = ?',
        [nombre, descripcion, estado, id]
      );
      connection.release();
      return { id, nombre, descripcion, estado };
    } catch (error) {
      console.error('Error en update:', error.message);
      throw error;
    }
  },

  // Eliminar item
  delete: async (id) => {
    try {
      const connection = await pool.getConnection();
      const [result] = await connection.query(
        'DELETE FROM items WHERE id = ?',
        [id]
      );
      connection.release();
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en delete:', error.message);
      throw error;
    }
  },
};

module.exports = Item;
