const z = require('zod')

const categorySchema = z.object({
  name: z.string().min(2, "Name is required")
})

module.exports = categorySchema