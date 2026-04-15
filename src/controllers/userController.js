const userService = require("../services/userService")

const getUsers = async (req, res, next) => {
  try {
  const users = await userService.getUsers()
  
  res.json(users)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUsers
}