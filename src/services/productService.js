const { Product, Category } = require('../models/associations')
const { getCategoryById } = require('./categoryService')

const findProductOrFail = async (id) => {
  const product = await Product.findByPk(id, { include: { model: Category, attributes: ["name"] } })
  if (!product) {
    const error = new Error("Product not found")
    error.status = 404
    throw error
  }
  return product
}

const getProducts = async () => {
  const products = await Product.findAll({ include: { model: Category, attributes: ["name"] } })
  return products
}

const getProductById = async (id) => {
  return findProductOrFail(id)
}

const createProduct = async (data) => {
  await getCategoryById(data.categoryId)

  return Product.create(data)
}

const updateProduct = async (id, data) => {
  const product = await findProductOrFail(id)
  
  return product.update(data)
}

const deleteProduct = async (id) => {
  const product = await findProductOrFail(id)
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