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
    next(error)
  }
}

module.exports = {
  getUsers,
  createUser
}