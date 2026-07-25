const User = require("../models/User")
const bcrypt = require("bcryptjs")

const createUserAdmin = async (data) => {
  const existingUser = await User.findOne({
    where: { email: data.email }
  })
  
  if (existingUser) {
  const error = new Error("User already exists!")
  error.status = 409
  throw error
  }
  
  const hashedPassword = await bcrypt.hash(data.password, 10) 
  
  const user = await User.create({
    name: data.name,
    email: data.email,
    password: hashedPassword,
    role: data.role
  })
  
  const { password, ...rest } = user.toJSON()
  
  return rest
}

module.exports = { createUserAdmin }