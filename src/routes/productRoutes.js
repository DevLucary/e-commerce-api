const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImage } = require('../controllers/productController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const uploadMiddleware = require('../middlewares/uploadMiddleware')
const adminMiddleware = require("../middlewares/adminMiddleware")

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', authMiddleware, adminMiddleware, createProduct)
router.patch('/:id/upload', authMiddleware, adminMiddleware, uploadMiddleware, uploadProductImage)
router.put('/:id', authMiddleware, adminMiddleware, updateProduct)
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct)

module.exports = router;