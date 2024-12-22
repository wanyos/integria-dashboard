import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import usersRouter from './routers/usersRoutes.js'
import incidentsRouter from './routers/incidentsRoutes.js'
import inventoryRouter from './routers/inventoryRoutes.js'
import reportRouter from './routers/reportRoutes.js'
import loginRouter from './routers/loginRoutes.js'
import { globalMiddleware, authMiddleware } from './middelware.js'

const app = express()

// Setting to get the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Dynamically build the path to the .env.development file
const envFile = `.env.${process.env.NODE_ENV || 'development'}`
const envPath = path.resolve(__dirname, envFile)
dotenv.config({ path: envPath })
const PORT = process.env.PORT || 8021

const corsOption = {
  origin: [
    'http://localhost:8022',
    `http://127.0.0.1:8022`,
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://10.10.14.37:5173',
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

//login
app.use('/api', loginRouter)

// routes
app.use('/api/report', reportRouter)
app.use('/api/users', authMiddleware, usersRouter)
app.use('/api/incidents', authMiddleware, incidentsRouter)
app.use('/api/inventory', authMiddleware, inventoryRouter)

app.use(globalMiddleware)

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
