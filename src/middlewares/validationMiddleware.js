const { body, validationResult } = require('express-validator');

const manejarErroresValidacion = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ mensaje: errores.array()[0].msg });
  }
  next();
};

const validarRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
  body('correo').isEmail().withMessage('El correo no es válido.'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  manejarErroresValidacion,
];

const validarActualizarPerfil = [
  body('nombre').optional().trim().notEmpty().withMessage('El nombre no puede estar vacío.'),
  body('correo').optional().isEmail().withMessage('El correo no es válido.'),
  body('telefono').optional().trim(),
  body('direccion').optional().trim(),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.'),
  body('rol').not().exists().withMessage('No tienes permiso para modificar el rol.'),
  body('activo').not().exists().withMessage('No tienes permiso para modificar el estado de la cuenta.'),
  manejarErroresValidacion,
];

const validarProducto = [
  body('nombre').trim().notEmpty().withMessage('El nombre del producto es obligatorio.'),
  body('precio').isFloat({ min: 0 }).withMessage('El precio debe ser un número positivo.'),
  body('variantes').isArray({ min: 1 }).withMessage('El producto debe tener al menos una variante.'),
  body('variantes.*.talla').trim().notEmpty().withMessage('La talla de cada variante es obligatoria.'),
  body('variantes.*.color').trim().notEmpty().withMessage('El color de cada variante es obligatorio.'),
  body('variantes.*.stock').isInt({ min: 0 }).withMessage('El stock de cada variante debe ser un número positivo.'),
  manejarErroresValidacion,
];

const validarPago = [
  body('metodoPago').isIn(['tarjeta', 'transferencia', 'efectivo']).withMessage('Método de pago inválido.'),
  body('montoPagado').isFloat({ min: 0 }).withMessage('El monto pagado debe ser un número positivo.'),
  manejarErroresValidacion,
];

const validarEstadoPedido = [
  body('estado').isIn(['Pendiente', 'Pagado', 'Enviado', 'Entregado']).withMessage('Estado inválido.'),
  manejarErroresValidacion,
];

module.exports = { validarRegistro, validarActualizarPerfil, validarProducto, validarPago, validarEstadoPedido };