const mongoose = require('mongoose');

// Sub-esquema para datos de tarjeta (solo últimos 4 dígitos — nunca el número completo)
const datosTarjetaSchema = new mongoose.Schema(
  {
    ultimosDigitos: {
      type: String,
      required: [true, 'Los últimos 4 dígitos son obligatorios'],
      match: [/^\d{4}$/, 'Deben ser exactamente 4 dígitos numéricos'],
    },
  },
  { _id: false }
);

const pagoSchema = new mongoose.Schema(
  {
    pedidoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pedido',
      required: [true, 'El pedidoId es obligatorio'],
    },
    metodoPago: {
      type: String,
      enum: ['tarjeta', 'transferencia', 'efectivo'],
      required: [true, 'El método de pago es obligatorio'],
    },
    estadoPago: {
      type: String,
      enum: ['pendiente', 'completado', 'fallido'],
      default: 'pendiente',
      // REGLA: Un pedido solo puede tener UN pago con estadoPago 'completado'
    },
    montoPagado: {
      type: Number,
      required: [true, 'El monto pagado es obligatorio'],
      min: [0, 'El monto no puede ser negativo'],
    },
    fechaPago: {
      type: Date,
      // Se asigna cuando estadoPago pasa a 'completado'
    },
    datosTarjeta: {
      type: datosTarjetaSchema,
      // Solo requerido cuando metodoPago es 'tarjeta'
    },
  },
  {
    timestamps: true,
  }
);

// Índice para garantizar que un pedido no tenga más de un pago completado
// (se valida en el controlador antes de insertar)
pagoSchema.index({ pedidoId: 1, estadoPago: 1 });

module.exports = mongoose.model('Pago', pagoSchema);