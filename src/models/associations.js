const Product = require('./Product')
const Category = require('./Category')

Product.belongsTo(Category, {
     foreignKey: 'categoryId' 
    })
Category.hasMany(Product, {
     foreignKey: 'categoryId' 
    })

module.exports = {
  Product,
  Category
}

