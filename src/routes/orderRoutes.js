const express = require('express')
const router = express.Router()
const { checkout, getOrderByUser } = require('../controllers/orderController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.post('/', authMiddleware, checkout)
router.get("/", authMiddleware, getOrderByUser)

module.exports = router