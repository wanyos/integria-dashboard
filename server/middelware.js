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
