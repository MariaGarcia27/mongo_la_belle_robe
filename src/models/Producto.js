const mongoose = require('mongoose');

// Sub-esquema para cada variante (talla + color + stock propio)
const varianteSchema = new mongoose.Schema(
  {
    talla: {
      type: String,
      required: [true, 'La talla es obligatoria'],
      trim: true,
      // Ejemplos: 'XS', 'S', 'M', 'L', 'XL', 'XXL' o tallas numéricas
    },
    color: {
      type: String,
      required: [true, 'El color es obligatorio'],
      trim: true,
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
      // IMPORTANTE: el stock es por combinación talla+color, no global
    },
  },
  { _id: true } // Cada variante tiene su propio _id para identificarla al crear pedidos
);

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    descripcion: {
      type: String,
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
      // Ejemplos: 'vestidos', 'blusas', 'pantalones', 'accesorios'
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    variantes: {
      type: [varianteSchema],
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: 'El producto debe tener al menos una variante (talla + color)',
      },
    },
    imagen: {
      type: String, // URL de la imagen
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Producto', productoSchema);