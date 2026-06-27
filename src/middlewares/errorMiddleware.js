const { ZodError } = require("zod")

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof ZodError) {
    const formattedError = err.errors.map((error) => ({
      field: error.path.join("."),
      message: error.message
    }))
      return res.status(400).json({
      error: "Validation failed",
      details: formattedError
    })
  }
  
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