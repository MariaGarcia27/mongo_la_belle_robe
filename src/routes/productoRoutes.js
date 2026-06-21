const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} = require('../controllers/productoController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/roleMiddleware');
const { validarProducto } = require('../middlewares/validationMiddleware');

// GET público
router.get('/', getProductos);
router.get('/:id', getProductoById);

// POST/PUT/DELETE protegidos — solo admin
router.post('/', verificarToken, verificarRol('admin'), validarProducto, createProducto);
router.put('/:id', verificarToken, verificarRol('admin'), validarProducto, updateProducto);
router.delete('/:id', verificarToken, verificarRol('admin'), deleteProducto);

module.exports = router;