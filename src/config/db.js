const Sequelize = require("sequelize")

let sequelize

if (process.env.DB_DIALECT === "sqlite") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  })

} else {
  sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql"
  })

}

module.exports = {
  Sequelize,
  sequelize
}