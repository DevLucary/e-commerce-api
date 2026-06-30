const { Cart, Product } = require('../models/associations')

const findProductOrFail = async (productId) => {
    const product = await Product.findByPk(productId)
    if (!product) {
        const error = new Error('Product not found')
        error.status = 404
        throw error
    }
    return product
}

const checkStockOrFail = async (product, quantity) => {
    if (product.stock < quantity) {
        const error = new Error('insufficient stock')
        error.status = 400
        throw error
    }
}

const findCartItemOrFail = async (cart, productId) => {
    const [cartItem] = await cart.getCartItems({where: {productId}})

    if (!cartItem) {
        const error = new Error('product not found')
        error.status = 404
        throw error
    }

    return cartItem
}

const getCart = async (userId) => {
    const [cart] = await Cart.findOrCreate({where: {userId}})
    return cart
}

const addToCart = async (userId, productId, quantity) => {
    const cart = await getCart(userId)
    const [cartItem] = await cart.getCartItems({ where: { productId }})
    const product = await findProductOrFail(productId)

        if(cartItem) {
        const newQuantity = quantity + cartItem.quantity
            
        await checkStockOrFail(product, newQuantity)

        const updatedProductInCartItem = await cartItem.update({ quantity: newQuantity, price: product.price})
        return updatedProductInCartItem
    } else {   
        await checkStockOrFail(product, quantity)
        
        const newCartItem = await cart.createCartItem({ productId, quantity, price: product.price })
        return newCartItem
    }
}

const getCartItems = async (userId) => {
    const cart = await getCart(userId)
    const cartItems = await cart.getCartItems({
        include : { model: Product }
    })
    return cartItems
}

const updateCartItem = async (userId, productId, quantity) => {
    const cart = await getCart(userId)
    const cartItem = await findCartItemOrFail(cart, productId)
    const product = await findProductOrFail(productId)

    await checkStockOrFail(product, quantity)

    const updatedCartItem = await cartItem.update({ quantity, price: product.price})
    return updatedCartItem
}

const removeFromCart = async (userId, productId) => {
    const cart = await getCart(userId)
    const cartItem = await findCartItemOrFail(cart, productId)

    await cartItem.destroy()
    return {
        message: 'Product removed from cart'
    }
}

const calculateTotal = async (userId) => {
    const cartItems = await getCartItems(userId)
    const total = cartItems.reduce((total,item) => (
        total + item.quantity * Number(item.price)
    ), 0)
    return Math.round(total * 100) / 100
}

module.exports = {
    getCart,
    addToCart,
    getCartItems,
    updateCartItem,
    removeFromCart,
    calculateTotal
}