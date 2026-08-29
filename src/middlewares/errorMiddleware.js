const { ZodError } = require("zod")
const logger = require("../config/logger")

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
  
  logger.error({err}, 'Erro no servidor:')
  
  
  res.status(status).json({
    error: true,
    status,
    message,
    timestamp: new Date().toISOString()
  })
}

module.exports = errorMiddleware