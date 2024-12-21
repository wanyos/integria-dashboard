import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_JWT_KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' })
  }
}

export const globalMiddleware = (err, req, res, next) => {
  console.error(err.stack)

  // Manejo de errores de validación general
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  // Manejo de errores de autorización
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized access' })
  }

  // Respuesta general para errores no manejados
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  })
}
