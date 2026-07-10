const z = require('zod')

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  order: z.enum(['desc', 'asc']).transform(value => value.toUpperCase()).optional(),
  sort: z.enum(["title", "price", "stock", "createdAt"]).optional(),
  minPrice: z.coerce.number().positive().optional(),
  maxPrice: z.coerce.number().positive().optional()
})

module.exports = {
  paginationSchema
}