const { Sequelize, sequelize, } = require("../config/db")

const Category = sequelize.define("category", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Category