const categoryService = require('../services/categoryService')
const categorySchema = require('../schemas/categorySchema')
const z = require('zod')

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await categoryService.getCategories()
    res.status(200).json(categories)
  } catch (error) {
    next(error)
  }
}

const getOneCategoryById = async (req, res, next) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id)
    res.status(200).json(category)
  } catch (error) {
    next(error)
  }
}

const createCategory = async (req, res, next) => {
    try {
        const validatedData = categorySchema.parse(req.body)
        const newCategory = await categoryService.createCategory(validatedData)
        res.status(201).json(newCategory)
    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
        const validatedData = categorySchema.parse(req.body)
        const updatedCategory = await categoryService.updateCategory(req.params.id, validatedData)
        res.status(200).json(updatedCategory)
    } catch (error) {
        next(error)
    }
}

const deleteCategory = async (req, res, next) => {
    try {
        const result = await categoryService.deleteCategory(req.params.id)
        res.status(200).json(result)
    } catch (error) {
        next(error)
    }
}

module.exports = {
  getAllCategories,
  getOneCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}