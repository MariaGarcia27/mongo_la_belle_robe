const express = require('express');
const router = express.Router();
const { register, login, getProfile, getUsuarios } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');
const { soloAdmin } = require('../middlewares/roleMiddleware');

// POST /api/auth/register — público
router.post('/register', register);

// POST /api/auth/login — público
router.post('/login', login);

// GET /api/auth/profile — requiere token válido (cualquier usuario autenticado)
router.get('/profile', verificarToken, getProfile);

// GET /api/auth/usuarios — requiere token válido y rol admin
router.get('/usuarios', verificarToken, soloAdmin, getUsuarios);

module.exports = router;