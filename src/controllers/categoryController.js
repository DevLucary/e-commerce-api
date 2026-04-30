const { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../services/categoryService')
const categorySchema = require('../schemas/categorySchema')
const z = require('zod')

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await getCategories()
    res.status(200).json(categories)
  } catch (error) {
    next(error)
  }
}

const getOneCategoryById = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id)
    res.status(200).json(category)
  } catch (error) {
    next(error)
  }
}

const createNewCategory = async (req, res, next) => {
    try {
        const validatedData = categorySchema.parse(req.body)
        const newCategory = await createCategory(validatedData)
        res.status(201).json(newCategory)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedError = error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message
            }))
            return res.status(400).json({
                error: "Validation failed",
                details: formattedError
            })
        }
        next(error)
    }
}

const updateCategories = async (req, res, next) => {
    try {
        const validatedData = categorySchema.parse(req.body)
        const updatedCategory = await updateCategory(req.params.id, validatedData)
        res.status(200).json(updatedCategory)
    } catch (error) {
        if (error instanceof z.ZodError) {
            const formattedError = error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message
            }))
            return res.status(400).json({
                error: "Validation failed",
                details: formattedError
            })
        }
        next(error)
    }
}

const deleteCategories = async (req, res, next) => {
    try {
        const result = await deleteCategory(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

module.exports = {
  getAllCategories,
  getOneCategoryById,
  createNewCategory,
  updateCategories,
  deleteCategories
}