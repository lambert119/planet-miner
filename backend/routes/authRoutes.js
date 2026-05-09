const express = require("express");
const authHandler = require("../middleware/authMiddleware/authHandler");
const asyncHandler = require("../middleware/authMiddleware/asyncHandler");
const loginHandler = require("../middleware/authMiddleware/loginHandler");
const registerHandler = require("../middleware/authMiddleware/registerHandler");
const { login, register } = require("../controllers/authController");

const router = express.Router();

router.post("/register", authHandler, asyncHandler(registerHandler), asyncHandler(register));
router.post("/login", authHandler, asyncHandler(loginHandler), asyncHandler(login));

module.exports = router;