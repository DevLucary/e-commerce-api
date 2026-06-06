const { Order, OrderItem, Product, CartItem } = require('../models/associations')
const { getCart, calculateTotal } = require('./cartService')
const { sequelize } = require('../config/db')

const checkout = async (userId) => {
    const transaction = await sequelize.transaction()

    try {
        const cart = await getCart(userId)
        const cartItems = await cart.getCartItems({ include: { model: Product }})

        if (cartItems.length === 0) {
            const error = new Error('No products to buy')
            error.status = 404
            throw error
        }

        const total = await calculateTotal(userId)
        
        for (const item of cartItems) {
            if (item.quantity > item.product.stock) { 
            const error = new Error(`Insufficient stock`)
            error.status = 400    
            throw error
        }
            await Product.decrement('stock', {
                by: item.quantity,
                where : { id: item.productId },
                transaction
            })
        }
        
        const order = await Order.create({
            userId,
            total,
            status: 'pending'
        }, { transaction })

        const orderItemsData = cartItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }))

        const orderItems = await OrderItem.bulkCreate(orderItemsData, { transaction })


        await CartItem.destroy({ where: {cartId: cart.id}, transaction })

        const itemsWithProduct = await order.getOrderItems({include: { model: Product }})

        await transaction.commit()
        return {
            userId: order.userId,
            orderId: order.id,
            total: order.total,
            products: itemsWithProduct
        }
    } catch (error) {
        await transaction.rollback()
        throw error
    }
}

module.exports = {
    checkout
}