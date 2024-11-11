/* eslint-disable no-undef */
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
// import usersRouter from './routers/usersRoutes.js'

const app = express()

// Configuración para obtener el directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Construir la ruta al archivo .env.development de forma dinámica
const envPath = path.resolve(__dirname, '.env.development')
dotenv.config({ path: envPath })
const PORT = process.env.PORT || 8021

// routes
app.get('/', (req, res) => {
  res.send('ia m here...')
})

app.use(express.json())
// app.use('/users', usersRouter)

app.listen(PORT, () => {
  console.log('port is listen...' + PORT)
})
