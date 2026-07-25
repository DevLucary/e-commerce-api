const express = require("express")
const router = express.Router()
const createAdminController = require("../controllers/adminController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const adminMiddleware = require("../middlewares/adminMiddleware")

router.post("/", authMiddleware, adminMiddleware, createAdminController)

module.exports = router