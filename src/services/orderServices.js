const { Order, OrderItem, Product, CartItem } = require('../models/associations')
const { getCart, calculateTotal } = require('./cartService')
const { sequelize } = require('../config/db')

const throwNoProductsToBuy = () => {
    const error = new Error('No products to buy')
    error.status = 404
    throw error
}

const findProductOrFail = async (productId, options) => {
    const product = await Product.findByPk(productId, options)

    if (!product) {
        const error = new Error(`Product not found (ID: ${productId})`)
        error.status = 404
        throw error
    }

    return product
}

const throwInsufficientStock = (productId) => {
    const error = new Error(`Insufficient stock for product ID ${productId}`)
    error.status = 400
    throw error
}

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
        const cartItems = await cart.getCartItems({
            include: { model: Product }
        })

        if (cartItems.length === 0) {
            throwNoProductsToBuy()
        }

        const total = await calculateTotal(userId)
        
        for (const item of cartItems) {
            const product = await findProductOrFail(item.productId, options)

            if (item.quantity > product.stock) { 
                throwInsufficientStock(item.productId)
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

        await OrderItem.bulkCreate(orderItemsData, options)


        await CartItem.destroy({ where: {cartId: cart.id}, ...options })

        const itemsWithProduct = await order.getOrderItems({include: { model: Product }})

        if (options.transaction) {
            await transaction.commit()
        }

        console.log(order.userId)
        console.log(order.id)
        console.log(order.total)
        console.log(itemsWithProduct)

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