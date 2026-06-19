require("dotenv").config()
const app = require("./app")

const { sequelize } = require("./config/db")
const { Product, Category, User, Cart, CartItem } = require("./models/associations")

sequelize.sync().then(() => {
  console.log("Banco pronto para o uso!")
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Servidor rodando na porta: "+ PORT)
})
}).catch((erro) => {
  console.error("Erro ao sincronizar com banco! " + erro)
})
