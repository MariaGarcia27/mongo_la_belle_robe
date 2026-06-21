require('dotenv').config();
const mongoose = require('mongoose');
const Usuario = require('./src/models/Usuario');
const Producto = require('./src/models/Producto');
const Pedido = require('./src/models/Pedido');
const Pago = require('./src/models/Pago');

async function test() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Conectado a MongoDB');

  // Usuario de prueba
  const user = await Usuario.create({
    nombre: 'Test User',
    correo: 'test@test.com',
    password: '123456',
    telefono: '1234567',
    direccion: 'Calle 1'
  });
  console.log('✅ Usuario creado, rol:', user.rol); // debe decir 'cliente'

  // Producto con variantes
  const producto = await Producto.create({
    nombre: 'Vestido Floral',
    categoria: 'vestidos',
    precio: 49.99,
    variantes: [
      { talla: 'S', color: 'rojo', stock: 5 },
      { talla: 'M', color: 'azul', stock: 3 }
    ]
  });
  console.log('✅ Producto creado con variantes:', producto.variantes.length);

  // Pedido
  const pedido = await Pedido.create({
    usuarioId: user._id,
    items: [{
      productoId: producto._id,
      nombre: producto.nombre,
      talla: 'S',
      color: 'rojo',
      cantidad: 1,
      precioUnitario: producto.precio
    }],
    total: 49.99,
    tipoEntrega: 'domicilio'
  });
  console.log('✅ Pedido creado, estado:', pedido.estado); // debe decir 'Pendiente'

  // Pago
  const pago = await Pago.create({
    pedidoId: pedido._id,
    metodoPago: 'tarjeta',
    montoPagado: 49.99,
    datosTarjeta: { ultimosDigitos: '4242' }
  });
  console.log('✅ Pago creado, estadoPago:', pago.estadoPago); // debe decir 'pendiente'

  // Limpiar datos de prueba
  await mongoose.connection.dropDatabase();
  console.log('🧹 Base de datos de prueba limpiada');
  await mongoose.disconnect();
}

test().catch(console.error);