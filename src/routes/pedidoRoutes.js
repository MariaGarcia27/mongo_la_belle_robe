const express = require('express');
const router = express.Router();
const { createPedido, getAllPedidos, getMisPedidos, updateEstado } = require('../controllers/pedidoController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/roleMiddleware');

// GET /api/pedidos/mis-pedidos — cliente autenticado ve sus pedidos
// IMPORTANTE: esta ruta debe ir ANTES de /:id para que no la intercepte
router.get('/mis-pedidos', verificarToken, getMisPedidos);

// GET /api/pedidos — solo admin, ve todos con populate
router.get('/', verificarToken, verificarRol('admin'), getAllPedidos);

// POST /api/pedidos — cliente crea pedido (valida stock)
router.post('/', verificarToken, createPedido);

// PUT /api/pedidos/:id/estado — solo admin actualiza estado
router.put('/:id/estado', verificarToken, verificarRol('admin'), updateEstado);

module.exports = router;