const Category = require('../models/Category')

const findCategoryOrFail = async (id) => {
  const category = await Category.findByPk(id)
  if (!category) {
    const error = new Error("Category not found")
    error.status = 404
    throw error
  }
  return category
}

const getCategories = async () => {
  return Category.findAll()
}

const getCategoryById = async (id) => {
  return findCategoryOrFail(id)
}

const createCategory = async (data) => {
  return Category.create( data )
}

const updateCategory = async (id, data) => {
  const category = await findCategoryOrFail(id)

  return category.update(data)

}

const deleteCategory = async (id) => {
  const category = await findCategoryOrFail(id)
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