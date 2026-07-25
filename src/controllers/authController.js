const z = require("zod")
const { loginSchema, refreshSchema } = require("../schemas/authSchema")
const { login, refresh } = require("../services/authService")

const loginUser = async (req, res, next ) => {
  try {
   const validatedData = loginSchema.parse(req.body)
    
    const loginResult = await login(validatedData)
    
    res.status(200).json(loginResult)
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const validatedData = refreshSchema.parse(req.body)

    const refreshResult = await refresh(validatedData.refreshToken)

    res.status(200).json(refreshResult)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  loginUser,
  refreshToken
}