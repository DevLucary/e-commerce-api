const User = require("../models/User")

const adminMiddleware = async (req, res, next) => {
    const user = await User.findByPk(req.userId)

    if (!user){
        return res.status(401).json({ message: "User not found"})
    }

    if (user.role !== "admin") {
        return res.status(403).json({ "error": "Access denied. Admin privileges required."})
    }

    next()
}

module.exports = adminMiddleware