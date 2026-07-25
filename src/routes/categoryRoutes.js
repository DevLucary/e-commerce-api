const express = require('express')
const router = express.Router()
const { getAllCategories, getOneCategoryById, createCategory, updateCategory, deleteCategory }= require('../controllers/categoryController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const adminMiddleware = require("../middlewares/adminMiddleware")

router.get('/', getAllCategories)
router.get('/:id', getOneCategoryById)
router.post('/', authMiddleware, adminMiddleware, createCategory)
router.put('/:id', authMiddleware, adminMiddleware, updateCategory)
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory)

module.exports = router