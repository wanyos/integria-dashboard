/* eslint-disable no-undef */
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import usersRouter from './routers/usersRoutes.js'
import incidentsRouter from './routers/incidentsRoutes.js'
import inventoryRouter from './routers/inventoryRoutes.js'

const app = express()

// Setting to get the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Dynamically build the path to the .env.development file
const envPath = path.resolve(__dirname, '.env.development')
dotenv.config({ path: envPath })
const PORT = process.env.PORT || 8021

const corsOption = {
  origin: [
    'http://localhost:8022',
    `http://127.0.0.1:8022`,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
  ],
  method: ['GET'],
  credentials: true,
  optionsSuccessStatus: 200,
}

if (process.env.NODE_ENV === 'test') {
  app.use(cors())
} else {
  app.use(cors(corsOption))
}

app.use(express.json())

// routes
app.use('/api/users', usersRouter)
app.use('/api/incidents', incidentsRouter)
app.use('/api/inventory', inventoryRouter)

app.get('/', (req, res) => {
  res.send('ia m here...')
})

// Middleware managed errors (always to end)
app.use((err, req, res, next) => {
  console.error(err.stack)

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized access' })
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
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
