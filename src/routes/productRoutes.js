const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadProductImage } = require('../controllers/productController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const uploadMiddleware = require('../middlewares/uploadMiddleware')

router.get('/', getAllProducts)
router.get('/:id', getProductById)
router.post('/', authMiddleware, createProduct)
router.patch('/:id/upload', authMiddleware, uploadMiddleware, uploadProductImage)
router.put('/:id', authMiddleware, updateProduct)
router.delete('/:id', authMiddleware,  deleteProduct)

module.exports = router;