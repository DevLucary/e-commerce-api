const express = require('express')
const router = express.Router()
const { getAllCategories, getOneCategoryById, createNewCategory, updateCategories, deleteCategories }= require('../controllers/categoryController')
const { authMiddleware } = require('../middlewares/authMiddleware')

router.get('/', getAllCategories)
router.get('/:id', getOneCategoryById)
router.post('/', authMiddleware, createNewCategory)
router.put('/:id', authMiddleware, updateCategories)
router.delete('/:id', authMiddleware, deleteCategories)

module.exports = router