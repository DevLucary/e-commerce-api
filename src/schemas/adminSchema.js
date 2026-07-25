const z = require("zod")

const adminSchema = z.object({
    name: z.string().min(2, { message: "The name must have more than 2 charaters"}),
    email: z.string().email({ message: "The Email format is invalid!"}),
    password: z.string().min(6, { message: "The password must have more 6 characters"}),
    role: z.enum(["admin", "customer"])
})

module.exports = adminSchema