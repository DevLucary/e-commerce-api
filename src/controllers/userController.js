const userService = require("../services/userService")
const z = require("zod")
const { createUserSchema } = require("../schemas/userSchema")

const getUsers = async (req, res, next) => {
  try {
  const users = await userService.getUsers()
  
  res.json(users)
  } catch (error) {
    next(error)
  }
}

const createUser = async (req, res, next) => {
  try {
    const validatedData = createUserSchema.parse(req.body)
    
    const user = await userService.createUser(validatedData)
    
    res.status(201).json(user)
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
  getUsers,
  createUser
}