const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

const verificarToken = async (req, res, next) => {
  try {
    // Leer el token del header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar el usuario en la base de datos (sin el password)
    const usuario = await Usuario.findById(decoded.id).select('-password');

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Token inválido. Usuario no encontrado.' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ mensaje: 'Cuenta desactivada. Contacta al administrador.' });
    }

    // Adjuntar el usuario al request para usarlo en los controladores
    req.user = usuario;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ mensaje: 'Token expirado. Inicia sesión nuevamente.' });
    }
    return res.status(401).json({ mensaje: 'Token inválido.' });
  }
};

module.exports = { verificarToken };