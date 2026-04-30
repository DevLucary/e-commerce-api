require("dotenv").config()
const express = require("express")
const app = express()
const userRoutes = require("./routes/userRoutes")
const errorMiddleware = require("./middlewares/errorMiddleware")
const { sequelize } = require("./config/db")
const User = require("./models/User")
const { Product, Category } = require("./models/associations")
const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes")
const categoryRoutes = require("./routes/categoryRoutes")

app.use(express.json())
app.use("/users", userRoutes)
app.use("/auth", authRoutes)
app.use("/products", productRoutes)
app.use("/categories", categoryRoutes)
app.use(errorMiddleware)

sequelize.sync().then(() => {
  console.log("Banco pronto para o uso!")
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Servidor rodando na porta: "+ PORT)
})
}).catch((erro) => {
  console.error("Erro ao sincronizar com banco! " + erro)
})
