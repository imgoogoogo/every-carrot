const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getChatList } = require("../controllers/chatController");

// GET /api/chats
router.get("/", authenticate, getChatList);

module.exports = router;
