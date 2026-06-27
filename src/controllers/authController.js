const z = require("zod")
const { loginSchema } = require("../schemas/authSchema")
const { login } = require("../services/authService")

const loginUser = async (req, res, next ) => {
  try {
   const validatedData = loginSchema.parse(req.body)
    
    const loginResult = await login(validatedData)
    
    res.status(200).json(loginResult)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  loginUser
}