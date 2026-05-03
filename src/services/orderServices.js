const { Order, OrderItem, Product, CartItem } = require('../models/associations')
const { getCart, calculateTotal } = require('./cartService')

const checkout = async (userId) => {
    const cart = await getCart(userId)
    const cartItems = await  cart.getCartItems()

    if (cartItems.length === 0) {
        const error = new Error('No products to buy')
        error.status = 404
        throw error
    }

    const total = await calculateTotal(userId)

    const order = await Order.create({
        userId,
        total,
        status: 'pending'
    })

    const orderItemsData = cartItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
    }))

    const orderItems = await OrderItem.bulkCreate(orderItemsData)

    for (const item of cartItems) {
        await Product.decrement('stock', {
            by: item.quantity,
            where : { id: item.productId }
        })
    }

    await CartItem.destroy({ where: {cartId: cart.id}})

    const itemsWithProduct = await order.getOrderItems({include: { model: Product }})

    return {
        userId: order.userId,
        orderId: order.id,
        total: order.total,
        products: itemsWithProduct
    }
}

module.exports = {
    checkout
}