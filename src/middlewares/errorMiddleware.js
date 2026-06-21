const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500;
  const mensaje = err.message || 'Error interno del servidor';

  // Sin stack trace en la respuesta
  res.status(status).json({ mensaje });
};

module.exports = errorMiddleware;