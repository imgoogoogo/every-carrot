const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getChatList, createChatRoom, getMessages } = require("../controllers/chatController");

// GET /api/chats
router.get("/", authenticate, getChatList);

// POST /api/chats
router.post("/", authenticate, createChatRoom);

// GET /api/chats/:id/messages
router.get("/:id/messages", authenticate, getMessages);

module.exports = router;
