const z = require("zod")

const loginSchema = z.object({
  email: z.string().email({ message: "Email format is invalid"}),
  password: z.string().min(1, { message: "Password is required"})
})

const refreshSchema = z.object({
  refreshToken: z.string()
})

module.exports = {
  loginSchema,
  refreshSchema
}