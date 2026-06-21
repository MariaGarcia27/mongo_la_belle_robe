const mongoose = require('mongoose');
const Pago = require('../models/Pago');
const Pedido = require('../models/Pedido');

/**
 * POST /api/pagos
 * Crea un pago — rechaza si el pedido ya tiene un pago completado
 */
const createPago = async (req, res) => {
  try {
    const { pedidoId, metodoPago, montoPagado, estadoPago, datosTarjeta } = req.body;

    if (!mongoose.Types.ObjectId.isValid(pedidoId)) {
      return res.status(400).json({ mensaje: 'ID de pedido inválido.' });
    }

    // Verificar que el pedido existe y pertenece al usuario autenticado
    const pedido = await Pedido.findById(pedidoId);
    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado.' });
    }

    if (pedido.usuarioId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensaje: 'No tienes permiso para pagar este pedido.' });
    }

    // REGLA CLAVE: un pedido solo puede tener UN pago completado
    const pagoCompletadoExistente = await Pago.findOne({
      pedidoId,
      estadoPago: 'completado',
    });

    if (pagoCompletadoExistente) {
      return res.status(400).json({
        mensaje: 'Este pedido ya tiene un pago completado. No se permiten pagos adicionales.',
      });
    }

    // Validar datos de tarjeta si el método es tarjeta
    if (metodoPago === 'tarjeta' && !datosTarjeta?.ultimosDigitos) {
      return res.status(400).json({ mensaje: 'Se requieren los últimos 4 dígitos de la tarjeta.' });
    }

    const nuevoPago = await Pago.create({
      pedidoId,
      metodoPago,
      montoPagado,
      estadoPago: estadoPago || 'pendiente',
      fechaPago: estadoPago === 'completado' ? new Date() : undefined,
      datosTarjeta: metodoPago === 'tarjeta' ? datosTarjeta : undefined,
    });

    // Solo actualizar pedido a 'Pagado' si el estadoPago es 'completado'
    if (estadoPago === 'completado') {
      await Pedido.findByIdAndUpdate(pedidoId, { estado: 'Pagado' });
    }
    // Si estadoPago es 'fallido' o 'pendiente', el pedido sigue en su estado actual

    res.status(201).json({ mensaje: 'Pago registrado exitosamente.', pago: nuevoPago });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ mensaje: mensajes.join(', ') });
    }
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * GET /api/pagos/mis-pagos
 * Pagos de los pedidos del cliente autenticado
 */
const getMisPagos = async (req, res) => {
  try {
    // Obtener los pedidos del usuario
    const pedidos = await Pedido.find({ usuarioId: req.user._id }).select('_id');
    const pedidoIds = pedidos.map((p) => p._id);

    const pagos = await Pago.find({ pedidoId: { $in: pedidoIds } }).populate(
      'pedidoId',
      'total estado tipoEntrega'
    );

    res.status(200).json({ total: pagos.length, pagos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

/**
 * GET /api/pagos
 * Todos los pagos — solo admin
 */
const getAllPagos = async (req, res) => {
  try {
    const pagos = await Pago.find().populate({
      path: 'pedidoId',
      select: 'total estado tipoEntrega',
      populate: { path: 'usuarioId', select: 'nombre correo' },
    });

    res.status(200).json({ total: pagos.length, pagos });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error interno del servidor.', error: error.message });
  }
};

module.exports = { createPago, getMisPagos, getAllPagos };