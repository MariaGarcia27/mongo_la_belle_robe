const Usuario = require('../models/Usuario');
const { compararPassword, generarToken } = require('../services/authService');

/**
 * POST /api/auth/register
 * Registro de nuevo usuario — siempre como 'cliente', ignorando cualquier rol del body
 */
const register = async (req, res) => {
  try {
    const { nombre, correo, password, telefono, direccion } = req.body;
    // IMPORTANTE: se desestructura sin 'rol' para ignorarlo completamente del body

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ correo });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Ya existe una cuenta con ese correo.' });
    }

    // Crear usuario — el rol siempre será 'cliente' (forzado por el schema y aquí explícitamente)
    const nuevoUsuario = await Usuario.create({
      nombre,
      correo,
      password, // el pre('save') del modelo lo hashea automáticamente
      telefono,
      direccion,
      rol: 'cliente', // forzado, sin importar lo que venga en el body
    });

    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente.',
      token,
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    // Error de validación de Mongoose
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * POST /api/auth/login
 * Login — compara password y retorna JWT con id y rol en el payload
 */
const login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios.' });
    }

    // Buscar usuario incluyendo el password (normalmente excluido con select: false)
    const usuario = await Usuario.findOne({ correo }).select('+password');

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Cuenta desactivada. Contacta al administrador.' });
    }

    // Comparar contraseña ingresada con el hash almacenado
    const passwordValido = await compararPassword(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
    }

    // Generar token con id y rol en el payload
    const token = generarToken(usuario);

    res.status(200).json({
      mensaje: 'Login exitoso.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * GET /api/auth/profile
 * Perfil del usuario autenticado — requiere token válido
 */
const getProfile = async (req, res) => {
  try {
    // req.user ya viene adjunto por el middleware verificarToken (sin password)
    const usuario = await Usuario.findById(req.user._id).select('-password');

    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * GET /api/auth/usuarios
 * Lista todos los usuarios — solo para admin
 */
const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');

    res.status(200).json({
      total: usuarios.length,
      usuarios,
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

module.exports = { register, login, getProfile, getUsuarios };