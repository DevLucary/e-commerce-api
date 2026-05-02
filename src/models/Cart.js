const { Sequelize, sequelize } = require('../config/db')
const User = require('./User')

const Cart = sequelize.define('carts', {
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    references: {
            model: User,
            key: 'id'
        }
    }
})

module.exports = Cart