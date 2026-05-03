const chatModel = require("../models/chatModel");

async function getChatList(req, res) {
  const userId = req.user.id;

  try {
    const rows = await chatModel.getChatListByUserId(userId);

    const data = rows.map((row) => ({
      id: row.id,
      product: {
        id: row.product_id,
        title: row.product_title,
        image_url: row.product_image_url,
        status: row.product_status,
      },
      opponent: {
        id: row.opponent_id,
        nickname: row.opponent_nickname,
        profile_image: row.opponent_profile_image,
      },
      is_seller: Boolean(row.is_seller),
      last_message: row.last_message_content
        ? { content: row.last_message_content, created_at: row.last_message_created_at }
        : null,
      unread_count: row.unread_count,
    }));

    return res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("채팅방 목록 조회 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "SERVER_ERROR" },
    });
  }
}

async function createChatRoom(req, res) {
  const buyerId = req.user.id;
  const { product_id, seller_id } = req.body;

  if (!product_id || !seller_id) {
    return res.status(400).json({
      success: false,
      message: "product_id와 seller_id는 필수 항목입니다.",
      error: { code: "MISSING_REQUIRED_FIELDS" },
    });
  }

  if (buyerId === seller_id) {
    return res.status(400).json({
      success: false,
      message: "자신의 상품에는 채팅을 시작할 수 없습니다.",
      error: { code: "CANNOT_CHAT_WITH_YOURSELF" },
    });
  }

  try {
    const product = await chatModel.findProductBySeller(product_id, seller_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "상품을 찾을 수 없습니다.",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    const existing = await chatModel.findExistingRoom(product_id, buyerId, seller_id);
    if (existing) {
      return res.status(200).json({ success: true, data: existing });
    }

    const newRoom = await chatModel.createRoom(product_id, buyerId, seller_id);
    return res.status(201).json({ success: true, data: newRoom });
  } catch (err) {
    console.error("채팅방 생성 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "SERVER_ERROR" },
    });
  }
}

async function getMessages(req, res) {
  const userId = req.user.id;
  const chatRoomId = parseInt(req.params.id);
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
  const offset = (page - 1) * limit;

  try {
    if (!(await chatModel.isParticipant(chatRoomId, userId))) {
      return res.status(403).json({
        success: false,
        message: "채팅방에 접근할 권한이 없습니다.",
        error: { code: "FORBIDDEN" },
      });
    }

    const total = await chatModel.countMessages(chatRoomId);
    const messages = await chatModel.getMessageList(chatRoomId, limit, offset);

    return res.status(200).json({
      success: true,
      data: { messages, pagination: { total, page, limit } },
    });
  } catch (err) {
    console.error("메시지 조회 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "SERVER_ERROR" },
    });
  }
}

async function saveMessage(req, res) {
  const userId = req.user.id;
  const chatRoomId = parseInt(req.params.id);
  const { content } = req.body;

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "메시지 내용을 입력해주세요.",
      error: { code: "MISSING_CONTENT" },
    });
  }

  if (content.length > 1000) {
    return res.status(400).json({
      success: false,
      message: "메시지는 최대 1000자까지 입력 가능합니다.",
      error: { code: "CONTENT_TOO_LONG" },
    });
  }

  try {
    if (!(await chatModel.isParticipant(chatRoomId, userId))) {
      return res.status(403).json({
        success: false,
        message: "채팅방에 접근할 권한이 없습니다.",
        error: { code: "FORBIDDEN" },
      });
    }

    const message = await chatModel.insertMessage(chatRoomId, userId, content.trim());
    return res.status(201).json({ success: true, data: message });
  } catch (err) {
    console.error("메시지 저장 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "SERVER_ERROR" },
    });
  }
}

async function markAsRead(req, res) {
  const userId = req.user.id;
  const chatRoomId = parseInt(req.params.id);

  try {
    if (!(await chatModel.isParticipant(chatRoomId, userId))) {
      return res.status(403).json({
        success: false,
        message: "채팅방에 접근할 권한이 없습니다.",
        error: { code: "FORBIDDEN" },
      });
    }

    const updatedCount = await chatModel.markMessagesAsRead(chatRoomId, userId);
    return res.status(200).json({
      success: true,
      message: "메시지를 읽음 처리했습니다.",
      data: { updated_count: updatedCount },
    });
  } catch (err) {
    console.error("읽음 처리 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "SERVER_ERROR" },
    });
  }
}

async function deleteChatRoom(req, res) {
  const userId = req.user.id;
  const chatRoomId = parseInt(req.params.id);

  try {
    if (!(await chatModel.isParticipant(chatRoomId, userId))) {
      return res.status(403).json({
        success: false,
        message: "채팅방에 접근할 권한이 없습니다.",
        error: { code: "FORBIDDEN" },
      });
    }

    await chatModel.deleteRoom(chatRoomId);
    return res.status(200).json({ success: true, message: "채팅방이 삭제되었습니다." });
  } catch (err) {
    console.error("채팅방 삭제 오류:", err);
    return res.status(500).json({
      success: false,
      message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      error: { code: "SERVER_ERROR" },
    });
  }
}

module.exports = { getChatList, createChatRoom, getMessages, saveMessage, markAsRead, deleteChatRoom };