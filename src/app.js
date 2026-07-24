const express = require("express")
const helmet = require("helmet")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const app = express()

const swagger = require("swagger-ui-express")
const userRoutes = require("./routes/userRoutes")
const errorMiddleware = require("./middlewares/errorMiddleware")
const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const cartRoutes = require('./routes/cartRoutes')
const orderRoutes = require('./routes/orderRoutes')
const swaggerDocs = require("./swagger.json")

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100
})

app.use(helmet())
app.use(cors({ origin: '*' }))
app.use(limiter)
app.use(express.json())
app.use("/images", express.static("images"))
app.use("/users", userRoutes)
app.use("/auth", authRoutes)
app.use("/products", productRoutes)
app.use("/categories", categoryRoutes)
app.use("/cart", cartRoutes)
app.use('/order', orderRoutes)
app.use("/api-docs", swagger.serve, swagger.setup(swaggerDocs))
app.use(errorMiddleware)

module.exports = app