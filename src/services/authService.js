const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const User = require("../models/User")
const crypto = require("crypto")
const { RefreshToken } = require("../models/associations")
const { sequelize } = require("../config/db")

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
  { expiresIn: "15m" })

  const refreshToken = crypto.randomBytes(40).toString('hex')

  const expiresDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await RefreshToken.create({
    token: refreshToken,
    userId: user.id,
    expiresAt: expiresDate
  })
  
  const { password:_, ...rest } = user.toJSON()
  
  return {
    token,
    user: rest,
    refreshToken
  }
}

const refresh = async (refreshToken) => {
  const transaction = await sequelize.transaction()

  try {
    const token = await RefreshToken.findOne({
      where: { token: refreshToken },
      transaction,
      lock: transaction.LOCK.UPDATE
    })

    if (!token) {
      const error = new Error("Invalid refresh token")
      error.status = 401
      throw error
    }

    const user = await User.findByPk(token.userId, {
      transaction
    })

    if (!user) {
      const error = new Error("User not found")
      error.status = 401
      throw error
    }

    if (new Date(token.expiresAt) < new Date()) {
      await token.destroy({ transaction })

      await transaction.commit()

      const error = new Error("Refresh token expired")
      error.status = 401
      throw error
    }

    await token.destroy({ transaction })

    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    )

    const newRefreshToken = crypto.randomBytes(40).toString("hex")

    const expiresDate = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    )

    await RefreshToken.create(
      {
        token: newRefreshToken,
        userId: user.id,
        expiresAt: expiresDate
      },
      { transaction }
    )

    await transaction.commit()

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken
    }
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback()
    }

    throw error
  }
}

module.exports = {
  login,
  refresh
}