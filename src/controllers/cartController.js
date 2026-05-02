const z = require('zod')
const cartService = require('../services/cartService')
const { cartSchema, updateCartItemSchema } = require('../schemas/cartSchema')

const addToCart = async (req, res, next) => {
 try {
    const validatedData = cartSchema.parse(req.body)
    const cartItem = await cartService.addToCart(req.userId, validatedData.productId, validatedData.quantity)
    res.status(201).json(cartItem)
 } catch (error) {
    if (error instanceof z.ZodError) {
        const formattedError = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
    }))

    return res.status(400).json({
        error:"Validation failed",
        details: formattedError
    })
    }

    next(error)
 }
}

const getCartItems = async (req, res, next) => {
    try{
        const cartItems = await cartService.getCartItems(req.userId)
        res.status(200).json(cartItems)
    } catch (error) {
        next(error)
    }
} 

const updateCartItem = async (req, res, next ) => {
    try {
        const { quantity } = updateCartItemSchema.parse(req.body)
        const updatedCartItem = await cartService.updateCartItem(req.userId, req.params.productId, quantity)
        res.status(200).json(updatedCartItem)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedError = error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message
            }))

            return res.status(400).json({
                error: "Validation failed",
                details: formattedError
            })
        }

        next(error)
    }
}


const removeFromCart = async (req, res, next) => {
    try {
        const message = await cartService.removeFromCart(req.userId, req.params.productId)
        res.status(200).json(message)
    } catch (error) {
        next(error)
    }
}

const calculateTotal = async (req, res, next) => {
    try {
        const total = await cartService.calculateTotal(req.userId)
        res.status(200).json(total)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    addToCart,
    getCartItems,
    updateCartItem,
    removeFromCart,
    calculateTotal
}