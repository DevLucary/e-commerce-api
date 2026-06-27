const fs = require('fs/promises')
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
        next(error)
    }
}

const updateProducts = async (req, res, next) => {
    try {
        const validatedData = updateProductSchema.parse(req.body)
        const updatedProduct = await updateProduct(req.params.id, validatedData)
        res.status(200).json(updatedProduct)
    } catch (error) {
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

const uploadProductImage = async (req, res, next) => {
    try {
        if (!req.file) {
            const error = new Error("Image not sent")
            error.status = 400
            throw error
        }

        await getProductById(req.params.id)

        const imagePath = `/images/products/${req.file.filename}`
        const updatedProduct = await updateProduct(req.params.id, { image: imagePath })
        res.status(200).json(updatedProduct)
    } catch (error) {
        if (req.file) {
            await fs.unlink(req.file.path).catch(() => {})
        }
        next(error)
    }
}

module.exports = {
    getAllProducts,
    getProductsById,
    createNewProduct,
    updateProducts,
    deleteProducts,
    uploadProductImage
}