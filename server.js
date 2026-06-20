require('dotenv').config()
const app = require('./app')

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Servidor La Belle Robe API corriendo en el puerto ${PORT}`)
  console.log(`Prueba de salud: http://localhost:${PORT}/api/health`)
})
