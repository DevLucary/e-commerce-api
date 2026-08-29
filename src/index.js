require("dotenv").config()

const app = require("./app")
const { sequelize } = require("./config/db")

const startServer = async () => {
  try {
    await sequelize.sync()

    console.log("Banco pronto para o uso!")

    const PORT = process.env.PORT || 3000

    app.listen(PORT, () => {
      console.log("Servidor rodando na porta: " + PORT)
    })
  } catch (error) {
    console.error("Erro ao sincronizar com banco:", error)
    process.exit(1)
  }
}

startServer()