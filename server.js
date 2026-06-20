require('dotenv').config()
const app = require('./app')
const connectDB = require('./src/config/db') 

const PORT = process.env.PORT || 3001

connectDB() 

app.listen(PORT, () => {
  console.log(`Servidor La Belle Robe API corriendo en el puerto ${PORT}`)
  console.log(`Prueba de salud: http://localhost:${PORT}/api/health`)
})
