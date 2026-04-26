const { Sequelize, sequelize } = require('../config/db')

const Product = sequelize.define('product', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  description: {
    type: Sequelize.TEXT
  },
  price: {
    type: Sequelize.DECIMAL(10, 2),
    allowNull: false
  },
  image: {
    type: Sequelize.STRING
  },
  categoryId: {
   type: Sequelize.INTEGER,
   allowNull: false
  }
})

module.exports = Product