const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const app = express()

// ── Middlewares globales ──────────────────────────────
app.use(helmet())
app.use(cors())
app.use(express.json())

// ── Ruta de salud (pública) ───────────────────────────
// El profe la pide explícitamente: GET /api/health
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mensaje: 'API La Belle Robe funcionando',
  })
})

// ── Rutas de la API ────────────────────────────────────
// A medida que se completen las demás issues, se van
// descomentando e importando aquí:
//
// const authRoutes = require('./src/routes/authRoutes')
// const productoRoutes = require('./src/routes/productoRoutes')
// const pedidoRoutes = require('./src/routes/pedidoRoutes')
// const pagoRoutes = require('./src/routes/pagoRoutes')
//
// app.use('/api/auth', authRoutes)
// app.use('/api/productos', productoRoutes)
// app.use('/api/pedidos', pedidoRoutes)
// app.use('/api/pagos', pagoRoutes)

// ── Ruta no encontrada (404) ──────────────────────────
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' })
})

// ── Middleware global de errores ──────────────────────
// Se implementa completo en la Issue #8 (src/middlewares/errorMiddleware.js)
// Por ahora dejamos uno básico para no romper el flujo.
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor',
  })
})

module.exports = app
