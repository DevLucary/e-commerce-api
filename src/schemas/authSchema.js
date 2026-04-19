const z = require("zod")

const loginSchema = z.object({
  email: z.string().email({ message: "Email format is invalid"}),
  password: z.string().min(1, { message: "Password is required"})
})

module.exports = {
  loginSchema
}