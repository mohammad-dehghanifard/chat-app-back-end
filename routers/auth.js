const express = require('express')
const controller = require('../controller/auth_cotroller')

const router = express.Router()

router.post("/register",controller.registerUser)
router.post("/signup",controller.signup)

module.exports = router