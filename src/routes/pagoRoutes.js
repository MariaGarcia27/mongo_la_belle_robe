const express = require('express');
const router = express.Router();
const { createPago, getMisPagos, getAllPagos } = require('../controllers/pagoController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { verificarRol } = require('../middlewares/roleMiddleware');
const { validarPago } = require('../middlewares/validationMiddleware');

// GET /api/pagos/mis-pagos — cliente ve sus pagos
router.get('/mis-pagos', verificarToken, getMisPagos);

// GET /api/pagos — solo admin
router.get('/', verificarToken, verificarRol('admin'), getAllPagos);

// POST /api/pagos — cliente autenticado con validaciones
router.post('/', verificarToken, validarPago, createPago);

module.exports = router;