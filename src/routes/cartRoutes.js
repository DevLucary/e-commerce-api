const express = require('express')
const router = express.Router()
const { addToCart, getCartItems, updateCartItem, removeFromCart, calculateTotal } = require('../controllers/cartController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.get('/items', authMiddleware, getCartItems)
router.get('/items/calculate', authMiddleware, calculateTotal)
router.post('/items', authMiddleware, addToCart)
router.put('/items/:productId', authMiddleware, updateCartItem)
router.delete('/items/:productId', authMiddleware, removeFromCart)

module.exports = router