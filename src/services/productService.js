const { Product, Category } = require('../models/associations')
const { getCategoryById } = require('./categoryService')
const { Op } = require('sequelize')

const findProductOrFail = async (id) => {
  const product = await Product.findByPk(id, { include: { model: Category, attributes: ["name"] } })
  if (!product) {
    const error = new Error("Product not found")
    error.status = 404
    throw error
  }
  return product
}

const getProducts = async (filters) => {
  const { page, limit, category, title, sort, order, minPrice, maxPrice } = filters

  const where = {}
  if (category) {
    where.categoryId = category
  }

  if (title) {
    where.title = { [Op.like]: `%${title}%` }
  }

  const orderBy = []

  if (sort && order) {
    orderBy.push([sort, order])
  } 

  if (sort) {
    orderBy.push([sort, 'ASC'])
  }

  if (minPrice !== undefined || maxPrice !== undefined) {

    where.price = {}

    if (minPrice !== undefined) {
      where.price[Op.gte] = minPrice
    }

    if (maxPrice !== undefined) {
      where.price[Op.lte] = maxPrice
    }
  }


  const pageNum = page || 1
  const limitNum = limit || 10

  const offset = (pageNum - 1) * limitNum

  const { rows, count } = await Product.findAndCountAll({ include: { model: Category, attributes: ["name"] }, limit: limitNum, offset, where, order: orderBy })
  
  return {
    products: rows,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total: count,
      totalPages: Math.ceil(count / limitNum)
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