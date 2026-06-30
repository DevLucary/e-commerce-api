const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/User")

const throwInvalidCredentials = () => {
  const error = new Error("Invalid credentials")
  error.status = 401
  throw error
}

const findUserOrFail = async (email) => {
  const user = await User.findOne({
    where: { email }
  })
  
  if(!user) {
    throwInvalidCredentials()
  }
  
  return user
}

const login = async (data) => {
  const { email, password } = data
  
  const user = await findUserOrFail(email)
  
  const isPasswordValid = await bcrypt.compare(password, user.password)
  
  if(!isPasswordValid) {
    throwInvalidCredentials()
  }
  
  const token = jwt.sign({ id: user.id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" })
  
  const { password:_, ...rest } = user.toJSON()
  
  return {
    token,
    user: rest
  }
}

module.exports = {
  login
}