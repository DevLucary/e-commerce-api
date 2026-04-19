const z = require("zod")
const { loginSchema } = require("../schemas/authSchema")
const { login } = require("../services/authService")

const loginUser = async (req, res, next ) => {
  try {
   const validatedData = loginSchema.parse(req.body)
    
    const loginResult = await login(validatedData)
    
    res.status(200).json(loginResult)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedError = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message
      }))
      
      return res.status(400).json({
        error: "Validation failed",
        details: formattedError
      })
    }
    next(error)
  }
}

module.exports = {
  loginUser
}