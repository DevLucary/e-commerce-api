const express = require('express')
const router = express.Router()
const { checkout } = require('../controllers/orderController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.post('/', authMiddleware, checkout)

module.exports = router