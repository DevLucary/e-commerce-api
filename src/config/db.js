const Sequelize = require("sequelize")
const fs = require("fs")

let sequelize

if (process.env.DB_DIALECT === "sqlite") {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false
  })
} else {
  const useSSL = process.env.DB_SSL === "true"

  const sslOptions = useSSL
    ? {
        ssl: {
          rejectUnauthorized: true,
          ca: fs.readFileSync(
            process.env.DB_CA_PATH,
            "utf8"
          )
        }
      }
    : {}

  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      dialect: "mysql",

      dialectOptions: sslOptions,

      pool: {
        max: 5,
        min: 1,
        acquire: 30000,
        idle: 10000
      }
    }
  )
}

module.exports = {
  Sequelize,
  sequelize
}