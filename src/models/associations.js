const Product = require('./Product')
const Category = require('./Category')
const Cart = require('./Cart')
const User = require('./User')
const CartItem = require('./CartItem')

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
  CartItem
}

