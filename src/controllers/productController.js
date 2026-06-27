const fs = require('fs/promises')
const productService = require('../services/productService');
const { createProductSchema, updateProductSchema } = require('../schemas/productSchema');
const z = require('zod')

const getAllProducts = async (req, res, next) => {
    try{
         const products = await productService.getProducts()
         res.status(200).json(products)
    }
    catch (error) {
        next(error)
    }
}

const getProductById = async (req, res, next) => {
    try{
        const product = await productService.getProductById(req.params.id)
        res.status(200).json(product)
    }
    catch (error) {
        next(error)
    }
}

const createProduct = async (req, res, next) => {
    try {
        const validatedData = createProductSchema.parse(req.body)
        const newProduct = await productService.createProduct(validatedData)
        res.status(201).json(newProduct)
    } catch (error) {
        next(error)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const validatedData = updateProductSchema.parse(req.body)
        const updatedProduct = await productService.updateProduct(req.params.id, validatedData)
        res.status(200).json(updatedProduct)
    } catch (error) {
        next(error)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const message = await productService.deleteProduct(req.params.id)
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

        await productService.getProductById(req.params.id)

        const imagePath = `/images/products/${req.file.filename}`
        const updatedProduct = await productService.updateProduct(req.params.id, { image: imagePath })
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
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
}