const { Order, OrderItem, Product, CartItem } = require('../models/associations')
const { getCart, calculateTotal } = require('./cartService')
const { sequelize } = require('../config/db')

const checkout = async (userId) => {
    let transaction
    let options
    if (process.env.DB_DIALECT === "sqlite") {
        options = {}
    } else {
        transaction = await sequelize.transaction()
        options = { transaction, lock:true }
    }

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
            let product

            product = await Product.findByPk(item.productId, {
                ...options
            })

            if(!product) {
                const error = new Error(`Product not found (ID: ${item.productId})`)
                error.status = 404
                throw error
            }

            if (item.quantity > product.stock) { 
            const error = new Error(`Insufficient stock for product ID ${item.productId}`)
            error.status = 400    
            throw error
            }

           product.stock -= item.quantity
           await product.save(options)
        }
        
        const order = await Order.create({
            userId,
            total,
            status: 'pending'
        }, options)

        const orderItemsData = cartItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }))

        const orderItems = await OrderItem.bulkCreate(orderItemsData, options)


        await CartItem.destroy({ where: {cartId: cart.id}, ...options })

        const itemsWithProduct = await order.getOrderItems({include: { model: Product }})

        if (options.transaction) {
            await transaction.commit()
        }
        return {
            userId: order.userId,
            orderId: order.id,
            total: order.total,
            products: itemsWithProduct
        }
    } catch (error) {
        if (options.transaction) {
            await transaction.rollback()
        }
        throw error
    }
}

module.exports = {
    checkout
}