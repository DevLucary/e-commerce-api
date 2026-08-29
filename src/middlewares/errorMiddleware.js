const logger = require("../config/logger")

const errorMiddleware = (err, req, res, next) => {
  const status = err.status || 500

  logger.error(err)

  const message =
    status === 500
      ? "Internal server error"
      : err.message

  return res.status(status).json({
    error: message
  })
}

module.exports = errorMiddleware