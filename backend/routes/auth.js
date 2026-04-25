const express = require("express");
const router = express.Router();
const { sendVerification, verifyEmail, register, login, logout, refresh } = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");

// POST /api/auth/send-verification
router.post("/send-verification", sendVerification);

// POST /api/auth/verify-email
router.post("/verify-email", verifyEmail);

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// POST /api/auth/logout (인증 필요)
router.post("/logout", authenticate, logout);

// POST /api/auth/refresh
router.post("/refresh", refresh);

module.exports = router;