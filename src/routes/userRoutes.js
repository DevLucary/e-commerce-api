const express = require("express")
const router = express.Router()
const { getUsers, createUser } = require("../controllers/userController")
const { authMiddleware } = require("../middlewares/authMiddleware")

router.get("/", authMiddleware, getUsers)

router.post("/", createUser)

module.exports = router