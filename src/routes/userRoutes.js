const express = require("express")
const router = express.Router()
const { getUsers, createUser } = require("../controllers/userController")
const { authMiddleware } = require("../middlewares/authMiddleware")
const adminMiddleware = require("../middlewares/adminMiddleware")

router.get("/", authMiddleware, adminMiddleware, getUsers)

router.post("/", createUser)

module.exports = router