require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Usuario = require('./src/models/Usuario');
const Producto = require('./src/models/Producto');
const Pedido = require('./src/models/Pedido');
const Pago = require('./src/models/Pago');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    // ── Limpiar las 4 colecciones ─────────────────────
    await Promise.all([
      Usuario.deleteMany(),
      Producto.deleteMany(),
      Pedido.deleteMany(),
      Pago.deleteMany(),
    ]);
    console.log('Colecciones limpiadas');

    // ── Usuarios ──────────────────────────────────────
    const passwordAdmin    = await bcrypt.hash('admin123', 10);
    const passwordCliente  = await bcrypt.hash('cliente123', 10);

    const [admin, cliente] = await Usuario.insertMany([
      {
        nombre:    'Administrador',
        correo:    'admin@labellerobe.com',
        password:  passwordAdmin,
        rol:       'admin',
        telefono:  '0414-0000000',
        direccion: 'Oficina Central, Caracas',
        activo:    true,
      },
      {
        nombre:    'Cliente Demo',
        correo:    'cliente@labellerobe.com',
        password:  passwordCliente,
        rol:       'cliente',
        telefono:  '0424-1234567',
        direccion: 'Av. Principal, Caracas',
        activo:    true,
      },
    ]);
    console.log('Usuarios insertados');

    // ── 12 Productos ──────────────────────────────────
    const productos = await Producto.insertMany([
      {
        nombre:      'Vestido Floral Midi',
        descripcion: 'Vestido de corte midi con estampado floral, perfecto para el día a día.',
        categoria:   'vestidos',
        precio:      89.99,
        imagen:      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1',
        activo:      true,
        variantes: [
          { talla: 'XS', color: 'rosa',   stock: 5 },
          { talla: 'S',  color: 'rosa',   stock: 8 },
          { talla: 'M',  color: 'rosa',   stock: 6 },
          { talla: 'S',  color: 'blanco', stock: 4 },
          { talla: 'M',  color: 'blanco', stock: 7 },
        ],
      },
      {
        nombre:      'Blusa de Seda Manga Larga',
        descripcion: 'Blusa elegante en seda natural, ideal para ocasiones formales.',
        categoria:   'blusas',
        precio:      65.00,
        imagen:      'https://images.unsplash.com/photo-1564257631407-4deb1f99d992',
        activo:      true,
        variantes: [
          { talla: 'S',  color: 'negro',  stock: 10 },
          { talla: 'M',  color: 'negro',  stock: 8  },
          { talla: 'L',  color: 'negro',  stock: 5  },
          { talla: 'S',  color: 'crema',  stock: 6  },
          { talla: 'M',  color: 'crema',  stock: 9  },
        ],
      },
      {
        nombre:      'Pantalón de Lino Wide Leg',
        descripcion: 'Pantalón holgado de lino, cómodo y sofisticado para el verano.',
        categoria:   'pantalones',
        precio:      74.99,
        imagen:      'https://images.unsplash.com/photo-1594938298603-c8148c4b0b8f',
        activo:      true,
        variantes: [
          { talla: 'S',  color: 'beige', stock: 7  },
          { talla: 'M',  color: 'beige', stock: 10 },
          { talla: 'L',  color: 'beige', stock: 5  },
          { talla: 'M',  color: 'blanco',stock: 6  },
          { talla: 'L',  color: 'blanco',stock: 4  },
        ],
      },
      {
        nombre:      'Falda Plisada Satinada',
        descripcion: 'Falda midi plisada en satén, con caída elegante y brillo sutil.',
        categoria:   'faldas',
        precio:      59.99,
        imagen:      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa',
        activo:      true,
        variantes: [
          { talla: 'XS', color: 'champagne', stock: 4 },
          { talla: 'S',  color: 'champagne', stock: 8 },
          { talla: 'M',  color: 'champagne', stock: 6 },
          { talla: 'S',  color: 'negro',     stock: 9 },
          { talla: 'M',  color: 'negro',     stock: 7 },
          { talla: 'L',  color: 'negro',     stock: 5 },
        ],
      },
      {
        nombre:      'Vestido Cóctel sin Mangas',
        descripcion: 'Vestido corto sin mangas con escote en V, perfecto para eventos.',
        categoria:   'vestidos',
        precio:      110.00,
        imagen:      'https://images.unsplash.com/photo-1595777457583-95e059d581b8',
        activo:      true,
        variantes: [
          { talla: 'S',  color: 'rojo',   stock: 5 },
          { talla: 'M',  color: 'rojo',   stock: 4 },
          { talla: 'S',  color: 'azul marino', stock: 6 },
          { talla: 'M',  color: 'azul marino', stock: 7 },
          { talla: 'L',  color: 'azul marino', stock: 3 },
        ],
      },
      {
        nombre:      'Cardigan Tejido Oversize',
        descripcion: 'Cardigan de punto oversize en lana suave, ideal para el otoño.',
        categoria:   'abrigos',
        precio:      79.99,
        imagen:      'https://images.unsplash.com/photo-1576566588028-4147f3842f27',
        activo:      true,
        variantes: [
          { talla: 'S',  color: 'gris',   stock: 8  },
          { talla: 'M',  color: 'gris',   stock: 10 },
          { talla: 'L',  color: 'gris',   stock: 7  },
          { talla: 'XL', color: 'gris',   stock: 4  },
          { talla: 'M',  color: 'camel',  stock: 6  },
          { talla: 'L',  color: 'camel',  stock: 5  },
        ],
      },
      {
        nombre:      'Top Cropped de Canalé',
        descripcion: 'Top corto ajustado en tejido de canalé, básico esencial del armario.',
        categoria:   'blusas',
        precio:      35.00,
        imagen:      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7',
        activo:      true,
        variantes: [
          { talla: 'XS', color: 'blanco', stock: 12 },
          { talla: 'S',  color: 'blanco', stock: 15 },
          { talla: 'M',  color: 'blanco', stock: 10 },
          { talla: 'XS', color: 'negro',  stock: 12 },
          { talla: 'S',  color: 'negro',  stock: 14 },
          { talla: 'M',  color: 'negro',  stock: 9  },
        ],
      },
      {
        nombre:      'Jeans Tiro Alto Skinny',
        descripcion: 'Jeans de tiro alto con corte skinny, en denim elástico premium.',
        categoria:   'pantalones',
        precio:      85.00,
        imagen:      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246',
        activo:      true,
        variantes: [
          { talla: 'S',  color: 'azul claro',  stock: 8  },
          { talla: 'M',  color: 'azul claro',  stock: 10 },
          { talla: 'L',  color: 'azul claro',  stock: 6  },
          { talla: 'S',  color: 'azul oscuro', stock: 7  },
          { talla: 'M',  color: 'azul oscuro', stock: 9  },
          { talla: 'L',  color: 'azul oscuro', stock: 5  },
        ],
      },
      {
        nombre:      'Vestido Maxi Boho',
        descripcion: 'Vestido largo de estilo bohemio con bordados artesanales en el escote.',
        categoria:   'vestidos',
        precio:      125.00,
        imagen:      'https://images.unsplash.com/photo-1550639525-c97d455acf70',
        activo:      true,
        variantes: [
          { talla: 'S',  color: 'terracota', stock: 4 },
          { talla: 'M',  color: 'terracota', stock: 6 },
          { talla: 'L',  color: 'terracota', stock: 3 },
          { talla: 'S',  color: 'verde',     stock: 5 },
          { talla: 'M',  color: 'verde',     stock: 7 },
        ],
      },
      {
        nombre:      'Blazer Estructurado',
        descripcion: 'Blazer de corte recto con hombreras sutiles, versátil para oficina y salidas.',
        categoria:   'abrigos',
        precio:      139.99,
        imagen:      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea',
        activo:      true,
        variantes: [
          { talla: 'S',  color: 'negro',  stock: 6 },
          { talla: 'M',  color: 'negro',  stock: 8 },
          { talla: 'L',  color: 'negro',  stock: 5 },
          { talla: 'S',  color: 'beige',  stock: 4 },
          { talla: 'M',  color: 'beige',  stock: 6 },
        ],
      },
      {
        nombre:      'Minifalda de Cuero Vegano',
        descripcion: 'Minifalda en cuero vegano con cierre lateral, look urbano y moderno.',
        categoria:   'faldas',
        precio:      69.99,
        imagen:      'https://images.unsplash.com/photo-1520006403909-838d6b92c22e',
        activo:      true,
        variantes: [
          { talla: 'XS', color: 'negro',  stock: 5 },
          { talla: 'S',  color: 'negro',  stock: 8 },
          { talla: 'M',  color: 'negro',  stock: 6 },
          { talla: 'S',  color: 'marrón', stock: 4 },
          { talla: 'M',  color: 'marrón', stock: 5 },
        ],
      },
      {
        nombre:      'Conjunto Loungewear Satinado',
        descripcion: 'Set de pantalón y top en satén, cómodo y elegante para estar en casa o salir.',
        categoria:   'conjuntos',
        precio:      95.00,
        imagen:      'https://images.unsplash.com/photo-1617019114583-affb34d1b3cd',
        activo:      true,
        variantes: [
          { talla: 'S',  color: 'lila',   stock: 6  },
          { talla: 'M',  color: 'lila',   stock: 8  },
          { talla: 'L',  color: 'lila',   stock: 4  },
          { talla: 'S',  color: 'rosa',   stock: 7  },
          { talla: 'M',  color: 'rosa',   stock: 9  },
          { talla: 'L',  color: 'rosa',   stock: 5  },
        ],
      },
    ]);
    console.log(`${productos.length} productos insertados`);

    // ── 2 Pedidos del cliente ─────────────────────────
    const pedido1 = await Pedido.create({
      usuarioId:    cliente._id,
      tipoEntrega:  'domicilio',
      estado:       'Pendiente',
      total:        124.99,
      items: [
        {
          productoId:     productos[0]._id,  // Vestido Floral Midi
          nombre:         productos[0].nombre,
          talla:          'S',
          color:          'rosa',
          cantidad:       1,
          precioUnitario: productos[0].precio,
        },
        {
          productoId:     productos[6]._id,  // Top Cropped de Canalé
          nombre:         productos[6].nombre,
          talla:          'S',
          color:          'blanco',
          cantidad:       1,
          precioUnitario: productos[6].precio,
        },
      ],
    });

    const pedido2 = await Pedido.create({
      usuarioId:    cliente._id,
      tipoEntrega:  'tienda',
      estado:       'Entregado',
      total:        85.00,
      items: [
        {
          productoId:     productos[7]._id,  // Jeans Tiro Alto Skinny
          nombre:         productos[7].nombre,
          talla:          'M',
          color:          'azul oscuro',
          cantidad:       1,
          precioUnitario: productos[7].precio,
        },
      ],
    });
    console.log('2 pedidos insertados');

    // ── 1 Pago del pedido2 (completado) ──────────────
    await Pago.create({
      pedidoId:     pedido2._id,
      metodoPago:   'tarjeta',
      estadoPago:   'completado',
      montoPagado:  85.00,
      fechaPago:    new Date(),
      datosTarjeta: { ultimosDigitos: '4242' },
    });
    console.log('1 pago insertado');

    // ── Resumen ───────────────────────────────────────
    console.log('\n Seed completado exitosamente');
    console.log('─────────────────────────────────────');
    console.log('Credenciales de prueba:');
    console.log('  Admin:   admin@labellerobe.com   / admin123');
    console.log('  Cliente: cliente@labellerobe.com / cliente123');
    console.log('─────────────────────────────────────\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error en el seed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seed();