const { Sequelize, sequelize } = require('../config/db')

const Order = sequelize.define('orders', {
    userId:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'pending'
    },
    total: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
    }
})

module.exports = Order