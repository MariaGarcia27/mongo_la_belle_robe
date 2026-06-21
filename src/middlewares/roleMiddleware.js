/**
 * Middleware de autorización por rol
 * Siempre debe usarse DESPUÉS de verificarToken
 */

const soloAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Se requiere rol de administrador.' });
  }
  next();
};

const soloCliente = (req, res, next) => {
  if (req.user.rol !== 'cliente') {
    return res.status(403).json({ mensaje: 'Acceso denegado. Solo para clientes.' });
  }
  next();
};

module.exports = { soloAdmin, soloCliente };