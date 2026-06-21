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

// GET público — cualquiera puede ver productos
router.get('/', getProductos);
router.get('/:id', getProductoById);

// POST/PUT/DELETE protegidos — solo admin
router.post('/', verificarToken, verificarRol('admin'), createProducto);
router.put('/:id', verificarToken, verificarRol('admin'), updateProducto);
router.delete('/:id', verificarToken, verificarRol('admin'), deleteProducto);

module.exports = router;