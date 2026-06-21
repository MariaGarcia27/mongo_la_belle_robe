const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Hashea una contraseña en texto plano
 * (En el modelo ya hay un pre('save') que hashea automáticamente,
 *  este método es útil si en algún momento se necesita hashear manualmente)
 */
const hashearPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compara una contraseña en texto plano con el hash almacenado
 */
const compararPassword = async (passwordIngresado, passwordHasheado) => {
  return bcrypt.compare(passwordIngresado, passwordHasheado);
};

/**
 * Genera un JWT con el id y rol del usuario en el payload
 */
const generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario._id,
      rol: usuario.rol,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = { hashearPassword, compararPassword, generarToken };