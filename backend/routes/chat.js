const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getChatList, createChatRoom } = require("../controllers/chatController");

// GET /api/chats
router.get("/", authenticate, getChatList);

// POST /api/chats
router.post("/", authenticate, createChatRoom);

module.exports = router;
