const express = require('express');
const router = express.Router();
const { createPedido, getAllPedidos, getMisPedidos, updateEstado } = require('../controllers/pedidoController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/roleMiddleware');
const { validarEstadoPedido } = require('../middlewares/validationMiddleware');

// GET /api/pedidos/mis-pedidos — cliente autenticado
router.get('/mis-pedidos', verificarToken, getMisPedidos);

// GET /api/pedidos — solo admin
router.get('/', verificarToken, verificarRol('admin'), getAllPedidos);

// POST /api/pedidos — cliente crea pedido
router.post('/', verificarToken, createPedido);

// PUT /api/pedidos/:id/estado — solo admin con validación
router.put('/:id/estado', verificarToken, verificarRol('admin'), validarEstadoPedido, updateEstado);

module.exports = router;