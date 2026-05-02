const z = require("zod")

const cartSchema = z.object({
  productId: z.number().int("Product ID must be an integer").positive("Product ID must be greater than zero"),
  quantity: z.number().int("Quantity must be an integer").positive("Quantity must be greater than zero" ).optional()
})

const updateCartItemSchema = z.object({
  quantity: z.number().int("Quantity must be an integer").positive("Quantity must be greater than zero" ).optional()
})

module.exports = {
  cartSchema,
  updateCartItemSchema
}