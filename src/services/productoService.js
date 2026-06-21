const Producto = require('../models/Producto');

const obtenerProductos = async () => {
  return Producto.find({ activo: true });
};

const obtenerProductoPorId = async (id) => {
  return Producto.findById(id);
};

const crearProducto = async (datos) => {
  return Producto.create(datos);
};

const actualizarProducto = async (id, datos) => {
  return Producto.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
};

const eliminarProducto = async (id) => {
  return Producto.findByIdAndUpdate(id, { activo: false }, { new: true });
};

module.exports = {
  obtenerProductos,
  obtenerProductoPorId,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};