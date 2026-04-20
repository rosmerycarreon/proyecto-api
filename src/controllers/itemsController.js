const Item = require('../models/Item');

const itemsController = {
  // GET /api/items - Obtener todos los items
  getAllItems: async (req, res, next) => {
    try {
      const items = await Item.getAll();
      res.status(200).json({
        message: 'Items recuperados exitosamente',
        count: items.length,
        data: items,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /api/items/:id - Obtener item por ID
  getItemById: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'El ID debe ser un número válido',
        });
      }

      const item = await Item.getById(id);
      if (!item) {
        return res.status(404).json({
          error: 'Item no encontrado',
          message: `No existe un item con ID ${id}`,
        });
      }

      res.status(200).json({
        message: 'Item recuperado exitosamente',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  },

  // POST /api/items - Crear nuevo item
  createItem: async (req, res, next) => {
    try {
      const { nombre, descripcion, estado } = req.body;

      const newItem = await Item.create(nombre, descripcion, estado);

      res.status(201).json({
        message: 'Item creado exitosamente',
        data: newItem,
      });
    } catch (error) {
      next(error);
    }
  },

  // PUT /api/items/:id - Actualizar item
  updateItem: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, estado } = req.body;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'El ID debe ser un número válido',
        });
      }

      // Verificar que el item existe
      const existingItem = await Item.getById(id);
      if (!existingItem) {
        return res.status(404).json({
          error: 'Item no encontrado',
          message: `No existe un item con ID ${id}`,
        });
      }

      // Usar valores existentes si no se proporciona el nuevo
      const updateNombre = nombre !== undefined ? nombre : existingItem.nombre;
      const updateDescripcion = descripcion !== undefined ? descripcion : existingItem.descripcion;
      const updateEstado = estado !== undefined ? estado : existingItem.estado;

      const updatedItem = await Item.update(id, updateNombre, updateDescripcion, updateEstado);

      res.status(200).json({
        message: 'Item actualizado exitosamente',
        data: updatedItem,
      });
    } catch (error) {
      next(error);
    }
  },

  // DELETE /api/items/:id - Eliminar item
  deleteItem: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
        return res.status(400).json({
          error: 'ID inválido',
          message: 'El ID debe ser un número válido',
        });
      }

      // Verificar que el item existe
      const existingItem = await Item.getById(id);
      if (!existingItem) {
        return res.status(404).json({
          error: 'Item no encontrado',
          message: `No existe un item con ID ${id}`,
        });
      }

      const deleted = await Item.delete(id);

      if (deleted) {
        res.status(200).json({
          message: 'Item eliminado exitosamente',
          data: { id },
        });
      } else {
        res.status(500).json({
          error: 'Error al eliminar',
          message: 'No se pudo eliminar el item',
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = itemsController;
