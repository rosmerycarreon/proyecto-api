const express = require('express');
const itemsController = require('../controllers/itemsController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateItem, validateItemUpdate } = require('../middleware/validationMiddleware');

const router = express.Router();

// Aplicar autenticación a todas las rutas de items
router.use(authMiddleware);

// GET /api/items - Obtener todos los items
router.get('/', itemsController.getAllItems);

// GET /api/items/:id - Obtener item por ID
router.get('/:id', itemsController.getItemById);

// POST /api/items - Crear nuevo item
router.post('/', validateItem, itemsController.createItem);

// PUT /api/items/:id - Actualizar item
router.put('/:id', validateItemUpdate, itemsController.updateItem);

// DELETE /api/items/:id - Eliminar item
router.delete('/:id', itemsController.deleteItem);

module.exports = router;
