const adminService = require("../services/adminService")
const adminSchema = require("../schemas/adminSchema")

const createAdminController = async (req, res, next) => {
  try {
    const validatedData = adminSchema.parse(req.body)
    
    const user = await adminService.createUserAdmin(validatedData)
    
    res.status(201).json(user)
  } catch (error) {
    next(error)
  }
}

module.exports = createAdminController