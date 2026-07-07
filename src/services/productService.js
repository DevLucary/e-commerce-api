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

const getProducts = async (page, limit) => {
  const pageNum = Number(page) || 1
  const limitNum = Number(limit) || 10

  const offset = (pageNum - 1) * limitNum
  
  const products = await Product.findAndCountAll({ include: { model: Category, attributes: ["name"] }, limit: limitNum, offset })
  return {
    products: products.rows,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: products.count,
      totalPages: Math.ceil(products.count / limitNum)
    }
  }
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