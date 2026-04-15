const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500
  const message = err.message
  
  console.error(`Erro no servidor: ${message}`)
  console.error(err.stack)
  
  res.status(status).json({
    error: true,
    status,
    message,
    timestamp: new Date().toISOString()
  })
}

module.exports = errorMiddleware