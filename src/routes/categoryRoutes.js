const express = require('express')
const router = express.Router()
const { getAllCategories, getOneCategoryById, createCategory, updateCategory, deleteCategory }= require('../controllers/categoryController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.get('/', getAllCategories)
router.get('/:id', getOneCategoryById)
router.post('/', authMiddleware, createCategory)
router.put('/:id', authMiddleware, updateCategory)
router.delete('/:id', authMiddleware, deleteCategory)

module.exports = router