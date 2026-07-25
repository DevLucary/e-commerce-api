const { Sequelize, sequelize } = require("../config/db")
const User = require("./User")

const RefreshToken = sequelize.define('refreshToken', {
    token: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    references: {
            model: User,
            key: 'id'
        }
    },
    expiresAt: {
        type: Sequelize.DATE,
    }
})

module.exports = RefreshToken