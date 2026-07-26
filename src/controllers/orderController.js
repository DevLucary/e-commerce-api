const orderService = require('../services/orderServices')

const checkout = async (req, res, next) => {
    try {
        const result = await orderService.checkout(req.userId)
        res.status(201).json(result)
    } catch (error) {
        next(error)
    }
}

const getOrderByUser = async (req, res, next) => {
    try {
        const result = await orderService.getOrderByUser(req.userId)
        
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    checkout,
    getOrderByUser
}