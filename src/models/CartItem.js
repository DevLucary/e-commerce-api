const { Sequelize, sequelize } = require('../config/db')
const Cart = require('./Cart')
const Product = require('./Product')

const CartItem = sequelize.define('cartItems', {
    cartId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Cart,
            key: 'id'
        }
    },
    productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'id'
        }
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
})

module.exports = CartItem