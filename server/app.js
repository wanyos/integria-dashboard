/* eslint-disable no-undef */
import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
// import usersRouter from './routers/usersRoutes.js'
// import incidentsRouter from './routers/incidentsRoutes.js'
// import inventoryRouter from './routers/inventoryRoutes.js'

const app = express()

// Configuración para obtener el directorio actual
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Construir la ruta al archivo .env.development de forma dinámica
const envPath = path.resolve(__dirname, '.env.development')
dotenv.config({ path: envPath })
const PORT = process.env.PORT || 8021

app.use(express.json())
// routes
// app.use('/api/users', usersRouter)
// app.use('/api/incidents', incidentsRouter)
// app.use('/api/inventory', inventoryRouter)

app.get('/', (req, res) => {
  res.send('ia m here...')
})

function startServer(port) {
  let actualPort = ''
  try {
    const server = app.listen(port, async () => {
      actualPort = server.address().port
      console.log(`Server listening on port ${actualPort}`)
    })

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Trying another port...`)
        // startServer(0);
      } else {
        console.error('Server error: ', err)
      }
    })
  } catch (err) {
    console.error('Error starting server: ', err)
  }
}

process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.')
  console.log('close the servers success !!!')
  process.exit(0)
})

startServer(PORT)
