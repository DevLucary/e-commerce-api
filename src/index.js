const express = require("express")
const app = express()
const userRoutes = require("./routes/userRoutes")
const errorMiddleware = require("./middlewares/errorMiddleware")

app.use(express.json())
app.use("/users", userRoutes)
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("Servidor rodando na porta: "+ PORT)
})