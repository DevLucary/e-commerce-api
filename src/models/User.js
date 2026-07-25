const { Sequelize, sequelize } = require("../config/db")

const User = sequelize.define("users",{
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  role: {
    type : Sequelize.STRING,
    allowNull: false,
    defaultValue: "customer"
  }
})

module.exports = User
