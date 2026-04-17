const User = require("../models/User")

const getUsers = async () => {
  const users = await User.findAll()
  
  return users.map((user) => {
   const { password, ...rest } = user.toJSON()
   return rest
  })
}

module.exports = {
  getUsers
}