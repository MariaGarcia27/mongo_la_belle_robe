const mongoose = require('mongoose');
const productoService = require('../services/productoService');

const getProductos = async (req, res) => {
  try {
    const productos = await productoService.obtenerProductos();
    res.status(200).json({ total: productos.length, productos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de producto inválido.' });
    }
    const producto = await productoService.obtenerProductoPorId(id);
    if (producto?.activo !== true) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }
    res.status(200).json({ producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

const createProducto = async (req, res) => {
  try {
    const producto = await productoService.crearProducto(req.body);
    res.status(201).json({ mensaje: 'Producto creado exitosamente.', producto });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

const updateProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de producto inválido.' });
    }
    const producto = await productoService.actualizarProducto(id, req.body);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }
    res.status(200).json({ mensaje: 'Producto actualizado exitosamente.', producto });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de producto inválido.' });
    }
    const producto = await productoService.eliminarProducto(id);
    if (!producto) {
      return res.status(404).json({ mensaje: 'Producto no encontrado.' });
    }
    res.status(200).json({ mensaje: 'Producto eliminado exitosamente.', producto });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };