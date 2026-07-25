const express = require("express")
const router = express.Router()
const { loginUser, refreshToken } = require("../controllers/authController")

router.post("/login", loginUser)
router.post("/refresh", refreshToken)

module.exports = router