const { Product, Category } = require('../models/associations')

const getProducts = async () => {
  const products = await Product.findAll({ include: { model: Category, attributes: ["name"] } })
  return products
}

const getProductById = async (id) => {
  const product = await Product.findByPk(id, { include: { model: Category, attributes: ["name"] } })
  if (!product) {
    const error = new Error("Product not found")
    error.status = 404
    throw error
  }
  return product
}

const createProduct = async (data) => {
  /*
  const category = await Category.findByPk(data.categoryId) 
  if (!category) {
    const error = new Error("Category not found")
    error.status = 404
    throw error
  }
  */
  const product = await Product.create( data )
  return product
}

const updateProduct = async (id, data) => {
  const product = await Product.findByPk(id)
  if (!product) {
    const error = new Error("Product not found")
    error.status = 404
    throw error
  }
  const updatedProduct = await product.update(data)

  return updatedProduct
}

const deleteProduct = async (id) => {
  const product = await Product.findByPk(id)
  if (!product) {
    const error = new Error("Product not found")
    error.status = 404
    throw error
  }
  await product.destroy()

  return { message: "Product deleted successfully" }
}


module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}