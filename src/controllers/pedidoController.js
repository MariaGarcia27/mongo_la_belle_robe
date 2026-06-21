const mongoose = require('mongoose');
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

/**
 * POST /api/pedidos
 * Crea un pedido validando stock por variante exacta (talla+color)
 */
const createPedido = async (req, res) => {
  try {
    const { items, tipoEntrega } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ mensaje: 'El pedido debe tener al menos un ítem.' });
    }

    let total = 0;
    const itemsValidados = [];

    // Validar stock y construir items antes de crear el pedido
    for (const item of items) {
      const { productoId, talla, color, cantidad } = item;

      if (!mongoose.Types.ObjectId.isValid(productoId)) {
        return res.status(400).json({ mensaje: `ID de producto inválido: ${productoId}` });
      }

      const producto = await Producto.findById(productoId);
      if (!producto || !producto.activo) {
        return res.status(404).json({ mensaje: `Producto no encontrado: ${productoId}` });
      }

      // Buscar la variante exacta talla+color
      const variante = producto.variantes.find(
        (v) => v.talla === talla && v.color === color
      );

      if (!variante) {
        return res.status(400).json({
          mensaje: `La variante talla "${talla}" / color "${color}" no existe en el producto "${producto.nombre}".`,
        });
      }

      // Validar stock suficiente
      if (variante.stock < cantidad) {
        return res.status(400).json({
          mensaje: `Stock insuficiente para "${producto.nombre}" (talla: ${talla}, color: ${color}). Disponible: ${variante.stock}, solicitado: ${cantidad}.`,
        });
      }

      total += producto.precio * cantidad;

      itemsValidados.push({
        productoId: producto._id,
        nombre: producto.nombre,
        talla,
        color,
        cantidad,
        precioUnitario: producto.precio,
        // Guardamos el _id de la variante para el descuento
        _varianteId: variante._id,
      });
    }

    // Descontar stock de cada variante
    for (const item of itemsValidados) {
      await Producto.updateOne(
        { _id: item.productoId, 'variantes._id': item._varianteId },
        { $inc: { 'variantes.$.stock': -item.cantidad } }
      );
    }

    // Crear el pedido (sin _varianteId, que era solo interno)
    const itemsParaGuardar = itemsValidados.map(({ _varianteId, ...rest }) => rest);

    const pedido = await Pedido.create({
      usuarioId: req.user._id,
      items: itemsParaGuardar,
      total,
      tipoEntrega,
    });

    res.status(201).json({ mensaje: 'Pedido creado exitosamente.', pedido });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * GET /api/pedidos
 * Todos los pedidos — solo admin, con datos del usuario
 */
const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find().populate('usuarioId', 'nombre correo');
    res.status(200).json({ total: pedidos.length, pedidos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * GET /api/pedidos/mis-pedidos
 * Solo los pedidos del cliente autenticado
 */
const getMisPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.find({ usuarioId: req.user._id });
    res.status(200).json({ total: pedidos.length, pedidos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * PUT /api/pedidos/:id/estado
 * Actualizar estado del pedido — solo admin
 */
const updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: 'ID de pedido inválido.' });
    }

    const estadosValidos = ['Pendiente', 'Pagado', 'Enviado', 'Entregado'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ mensaje: `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}` });
    }

    const pedido = await Pedido.findByIdAndUpdate(
      id,
      { estado },
      { new: true, runValidators: true }
    );

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }

    res.status(200).json({ mensaje: 'Estado actualizado exitosamente.', pedido });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

module.exports = { createPedido, getAllPedidos, getMisPedidos, updateEstado };