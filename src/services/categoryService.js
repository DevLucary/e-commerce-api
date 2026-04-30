const Category = require('../models/Category')

const getCategories = async () => {
  const categories = await Category.findAll()
  return categories
}

const getCategoryById = async (id) => {
  const category = await Category.findByPk(id)
  if (!category) {
    const error = new Error("Category not found")
    error.status = 404
    throw error
  }
  return category
}

const createCategory = async (data) => {
  const category = await Category.create( data )
  return category
}

const updateCategory = async (id, data) => {
  const category = await Category.findByPk(id)
  if (!category) {
    const error = new Error("Category not found")
    error.status = 404
    throw error
  }
  const updatedCategory = await category.update(data)

  return updatedCategory
}

const deleteCategory = async (id) => {
  const category = await Category.findByPk(id)
  if (!category) {
    const error = new Error("Category not found")
    error.status = 404
    throw error
  }
  await category.destroy()

  return { message: "Category deleted successfully" }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}