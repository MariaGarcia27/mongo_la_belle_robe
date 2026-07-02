const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, getUsuarios } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { soloAdmin } = require('../middlewares/roleMiddleware');
const { loginLimiter } = require('../middlewares/rateLimitMiddleware');
const { validarRegistro, validarActualizarPerfil } = require('../middlewares/validationMiddleware');

// POST /api/auth/register — público con validaciones
router.post('/register', validarRegistro, register);

// POST /api/auth/login — público con rate limit
router.post('/login', loginLimiter, login);

// GET /api/auth/profile — requiere token válido
router.get('/profile', verificarToken, getProfile);

// PUT /api/auth/profile — requiere token válido; el usuario edita solo sus propios datos
router.put('/profile', verificarToken, validarActualizarPerfil, updateProfile);

// GET /api/auth/usuarios — requiere token válido y rol admin
router.get('/usuarios', verificarToken, soloAdmin, getUsuarios);

module.exports = router;