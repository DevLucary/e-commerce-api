const Product = require('./Product')
const Category = require('./Category')
const Cart = require('./Cart')
const User = require('./User')
const CartItem = require('./CartItem')
const Order = require('./Order')
const OrderItem = require('./OrderItem')

Order.belongsTo(User, {
    foreignKey: 'userId'
})
User.hasMany(Order, {
    foreignKey: 'userId'
})

OrderItem.belongsTo(Product, {
    foreignKey: 'productId'
})
Product.hasMany(OrderItem, {
    foreignKey: 'productId'
})

OrderItem.belongsTo(Order, {
    foreignKey: 'orderId'
})
Order.hasMany(OrderItem, {
    foreignKey: 'orderId'
})



Cart.belongsTo(User, {
     foreignKey: 'userId' 
    })
User.hasOne(Cart, {
     foreignKey: 'userId' 
    })

CartItem.belongsTo(Cart, {
     foreignKey: 'cartId' 
    })
Cart.hasMany(CartItem, {
     foreignKey: 'cartId' 
    })

CartItem.belongsTo(Product, {
     foreignKey: 'productId' 
    })
Product.hasMany(CartItem, {
     foreignKey: 'productId' 
    })



Product.belongsTo(Category, {
     foreignKey: 'categoryId' 
    })
Category.hasMany(Product, {
     foreignKey: 'categoryId' 
    })

module.exports = {
  Product,
  Category,
  Cart,
  User,
  CartItem,
  Order,
  OrderItem
}

