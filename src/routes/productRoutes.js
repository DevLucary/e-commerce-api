const express = require('express');
const router = express.Router();
const { getAllProducts, getProductsById, createNewProduct, updateProducts, deleteProducts } = require('../controllers/productController')

router.get('/', getAllProducts)
router.get('/:id', getProductsById)
router.post('/', createNewProduct)
router.put('/:id', updateProducts)
router.delete('/:id', deleteProducts)

module.exports = router;