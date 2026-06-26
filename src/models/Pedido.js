const mongoose = require('mongoose');

// Sub-esquema para cada ítem del pedido (embebido, snapshot del producto al momento de comprar)
const itemSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El productoId es obligatorio en el ítem'],
    },
    nombre: {
      type: String,
      required: true, // Snapshot del nombre en el momento del pedido
    },
    talla: {
      type: String,
      required: [true, 'La talla del ítem es obligatoria'],
    },
    color: {
      type: String,
      required: [true, 'El color del ítem es obligatorio'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad debe ser al menos 1'],
    },
    precioUnitario: {
      type: Number,
      required: true, // Snapshot del precio al momento del pedido
      min: [0, 'El precio unitario no puede ser negativo'],
    },
  },
  { _id: false } // No necesitamos _id por ítem, el array ya es parte del pedido
);

const pedidoSchema = new mongoose.Schema(
  {
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El usuarioId es obligatorio'],
    },
    items: {
      type: [itemSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'El pedido debe contener al menos un ítem',
      },
    },
    total: {
      type: Number,
      required: [true, 'El total es obligatorio'],
      min: [0, 'El total no puede ser negativo'],
    },
    estado: {
      type: String,
      enum: ['Pendiente', 'Pagado', 'Enviado', 'Entregado'],
      default: 'Pendiente',
      // Solo pasa a 'Pagado' cuando el pago tiene estadoPago: 'completado'
    },
    tipoEntrega: {
      type: String,
      enum: ['domicilio', 'tienda'],
      required: [true, 'El tipo de entrega es obligatorio'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Pedido', pedidoSchema);