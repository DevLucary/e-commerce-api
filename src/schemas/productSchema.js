const z = require("zod")

const createProductSchema = z.object({
  title: z.string().min(2, "title is required"),
  description: z.string().optional(),
  price: z.number().positive("price must be a positive number"),
  categoryId: z
    .number()
    .int("category ID must be an integer")
    .positive("category ID must be a positive number"),
  image: z.string().url().optional(),
  stock: z
    .number()
    .int("stock must be an integer")
    .min(0, "stock cannot be negative")
    .optional()
})

const updateProductSchema = createProductSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "at least one field must be provided" }
  )

module.exports = {
  createProductSchema,
  updateProductSchema
}