const express = require('express');
const router = express.Router();
const { getAllProducts, getProductsById, createNewProduct, updateProducts, deleteProducts, uploadProductImage } = require('../controllers/productController')
const { authMiddleware } = require('../middlewares/authMiddleware')
const uploadMiddleware = require('../middlewares/uploadMiddleware')

router.get('/', getAllProducts)
router.get('/:id', getProductsById)
router.post('/', authMiddleware, createNewProduct)
router.patch('/:id/upload', authMiddleware, uploadMiddleware, uploadProductImage)
router.put('/:id', authMiddleware, updateProducts)
router.delete('/:id', authMiddleware,  deleteProducts)

module.exports = router;