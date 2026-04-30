const express = require('express');
const router = express.Router();
const { getAllProducts, getProductsById, createNewProduct, updateProducts, deleteProducts } = require('../controllers/productController')
const { authMiddleware } = require('../middlewares/authMiddleware')
router.get('/', getAllProducts)
router.get('/:id', getProductsById)
router.post('/', authMiddleware, createNewProduct)
router.put('/:id', authMiddleware, updateProducts)
router.delete('/:id', authMiddleware, deleteProducts)

module.exports = router;