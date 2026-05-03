const { Sequelize, sequelize } = require('../config/db')
const Order = require('./Order')
const Product = require('./Product')

const OrderItem = sequelize.define('orderItems', {
    orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: Order,
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

module.exports = OrderItem