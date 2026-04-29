const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../services/productService');
const { createProductSchema, updateProductSchema } = require('../schemas/productSchema');
const z = require('zod')

const getAllProducts = async (req, res, next) => {
    try{
         const products = await getProducts()
         res.status(200).json(products)
    }
    catch (error) {
        next(error)
    }
}

const getProductsById = async (req, res, next) => {
    try{
        const product = await getProductById(req.params.id)
        res.status(200).json(product)
    }
    catch (error) {
        next(error)
    }
}

const createNewProduct = async (req, res, next) => {
    try {
        const validatedData = createProductSchema.parse(req.body)
        const newProduct = await createProduct(validatedData)
        res.status(201).json(newProduct)
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

const updateProducts = async (req, res, next) => {
    try {
        const validatedData = updateProductSchema.parse(req.body)
        const updatedProduct = await updateProduct(req.params.id, validatedData)
        res.status(200).json(updatedProduct)
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

const deleteProducts = async (req, res, next) => {
    try {
        const message = await deleteProduct(req.params.id)
        res.status(200).json(message)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllProducts,
    getProductsById,
    createNewProduct,
    updateProducts,
    deleteProducts
}