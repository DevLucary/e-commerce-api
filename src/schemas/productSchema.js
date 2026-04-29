const z = require('zod')
const Category = require('../models/Category')

const createProductSchema = z.object({
    title: z.string().min(2, "title is required"),
    description: z.string().optional(),
    price: z.number().positive("price it must be a positive number"),
    categoryId: z.number().int("category ID must be a number integer").positive("category ID must be a positive number").optional(),
    image: z.string().url().optional()
})

const updateProductSchema = createProductSchema.partial()

module.exports = {
    createProductSchema,
    updateProductSchema
}