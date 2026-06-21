const express = require('express');
const router = express.Router();
const { createPago, getMisPagos, getAllPagos } = require('../controllers/pagoController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/roleMiddleware');

// GET /api/pagos/mis-pagos — cliente ve sus pagos
// IMPORTANTE: antes de /:id para que no sea interceptada
router.get('/mis-pagos', verificarToken, getMisPagos);

// GET /api/pagos — solo admin
router.get('/', verificarToken, verificarRol('admin'), getAllPagos);

// POST /api/pagos — cliente autenticado crea un pago
router.post('/', verificarToken, createPago);

module.exports = router;