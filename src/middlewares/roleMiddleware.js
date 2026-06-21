/**
 * Middleware de autorización por rol
 * Siempre debe usarse DESPUÉS de verificarToken
 */

const verificarRol = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ 
        mensaje: 'No tienes permiso para realizar esta acción' 
      });
    }
    next();
  };
};

// Atajos para los casos más comunes
const soloAdmin = verificarRol('admin');
const soloCliente = verificarRol('cliente');

module.exports = { verificarRol, soloAdmin, soloCliente };