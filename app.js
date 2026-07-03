const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const errorMiddleware = require('./src/middlewares/errorMiddleware')

const app = express()

// ── Middlewares globales ──────────────────────────────
app.use(helmet())

// ── CORS CONFIG ───────────────────────────────────────
const allowedOrigins = [
  'http://localhost:5173',
  'https://la-belle-robe-app.vercel.app'
]

const corsOptions = {
  origin: (origin, callback) => {
    // Permite herramientas como Postman o requests sin origin
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    return callback(new Error('No permitido por CORS'))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}

app.use(cors(corsOptions))

// ── Parse JSON ─────────────────────────────────────────
app.use(express.json({ limit: '5mb' }))

// ── Ruta de salud (pública) ───────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    mensaje: 'API La Belle Robe funcionando',
  })
})

// ── Rutas de la API ────────────────────────────────────
const authRoutes = require('./src/routes/authRoutes')
const productoRoutes = require('./src/routes/productoRoutes')
const pedidoRoutes = require('./src/routes/pedidoRoutes')
const pagoRoutes = require('./src/routes/pagoRoutes')

app.use('/api/auth', authRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/pedidos', pedidoRoutes)
app.use('/api/pagos', pagoRoutes)

// ── Ruta no encontrada (404) ──────────────────────────
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' })
})

// ── Middleware global de errores ──────────────────────
app.use(errorMiddleware)

module.exports = app