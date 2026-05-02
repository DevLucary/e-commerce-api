const { Cart, Product } = require('../models/associations')


const getCart = async (userId) => {
    const [cart] = await Cart.findOrCreate({where: {userId}})
    return cart
}


const addToCart = async (userId, productId, quantity) => {
    const cart = await getCart(userId)
    const [cartItem] = await cart.getCartItems({ where: { productId }})
    const product = await Product.findByPk(productId)

    if (!product) {
        const error = new Error('Product not found')
        error.status = 404
        throw error
    }

    if(cartItem) {
        if (product.stock < cartItem.quantity + quantity) {
            const error = new Error('insufficient stock')
            error.status = 400
            throw error
        }
        
        const updatedProduct = await cartItem.update({ quantity, price: product.price})
        return updatedProduct
    } else {
        if( product.stock < quantity) {
            const error = new Error('insufficient stock')
            error.status = 400
            throw error
        }

        const newCartItem = await cart.createCartItem({ productId, quantity, price: product.price })
        return newCartItem
    }
}

const getCartItems = async (userId) => {
    const cart = await getCart(userId)
    const cartItems = await cart.getCartItems({include: { model: Product }})
    return cartItems
}

const updateCartItem = async (userId, productId, quantity) => {
    const cart = await getCart(userId)
    const [cartItem] = await cart.getCartItems({where: {productId}})
    const product = await Product.findByPk(productId)

    if (!cartItem) {
        const error = new Error('product not found')
        error.status = 404
        throw error
    }

    if (!product) {
        const error = new Error('product not found')
        error.status = 404
        throw error
    }

    if (product.stock < quantity) {
        const error = new Error('insufficient stock')
        error.status = 400
        throw error
    }

    const updatedCartItem = await cartItem.update({ quantity, price: product.price})
    return updatedCartItem
}

const removeFromCart = async (userId, productId) => {
    const cart = await getCart(userId)
    const [cartItem] = await cart.getCartItems({ where: {productId}})

    if (!cartItem) {
        const error = new Error('product not found')
        error.status = 404
        throw error
    }

    await cartItem.destroy()
    return {
        message: 'Product removed from cart'
    }
}

const calculateTotal = async (userId) => {
    const cartItems = await getCartItems(userId)
    return cartItems.reduce((total,item) => (
        total + item.quantity * parseFloat(item.price)
    ), 0)
}

module.exports = {
    addToCart,
    getCartItems,
    updateCartItem,
    removeFromCart,
    calculateTotal
}