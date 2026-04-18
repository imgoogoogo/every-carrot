const pool = require("../config/db");

async function getChatList(req, res) {
  const userId = req.user.id;

  try {
    const [rows] = await pool.query(
      `SELECT
         cr.id,
         p.id           AS product_id,
         p.title        AS product_title,
         p.image_url    AS product_image_url,
         p.status       AS product_status,
         IF(cr.buyer_id = ?, su.id,            bu.id)            AS opponent_id,
         IF(cr.buyer_id = ?, su.nickname,      bu.nickname)      AS opponent_nickname,
         IF(cr.buyer_id = ?, su.profile_image, bu.profile_image) AS opponent_profile_image,
         lm.content     AS last_message_content,
         lm.created_at  AS last_message_created_at,
         (
           SELECT COUNT(*)
           FROM   messages
           WHERE  chat_room_id = cr.id
             AND  sender_id   != ?
             AND  is_read      = FALSE
         ) AS unread_count
       FROM chat_rooms cr
       JOIN products p  ON cr.product_id = p.id
       JOIN users    bu ON cr.buyer_id   = bu.id
       JOIN users    su ON cr.seller_id  = su.id
       LEFT JOIN (
         SELECT m1.chat_room_id, m1.content, m1.created_at
         FROM   messages m1
         INNER JOIN (
           SELECT chat_room_id, MAX(created_at) AS max_created_at
           FROM   messages
           GROUP  BY chat_room_id
         ) m2 ON m1.chat_room_id = m2.chat_room_id
              AND m1.created_at  = m2.max_created_at
       ) lm ON lm.chat_room_id = cr.id
       WHERE cr.buyer_id = ? OR cr.seller_id = ?
       ORDER BY lm.last_message_created_at IS NULL ASC,
                lm.last_message_created_at DESC`,
      [userId, userId, userId, userId, userId, userId]
    );

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
      last_message: row.last_message_content
        ? {
            content: row.last_message_content,
            created_at: row.last_message_created_at,
          }
        : null,
      unread_count: row.unread_count,
    }));

    return res.status(200).json({
      success: true,
      data,
    });
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
    // 상품 존재 여부 확인
    const [productRows] = await pool.query(
      "SELECT id FROM products WHERE id = ? AND seller_id = ?",
      [product_id, seller_id]
    );
    if (productRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "상품을 찾을 수 없습니다.",
        error: { code: "PRODUCT_NOT_FOUND" },
      });
    }

    // 기존 채팅방 조회
    const [existing] = await pool.query(
      `SELECT id, product_id, buyer_id, seller_id, created_at
       FROM chat_rooms
       WHERE product_id = ? AND buyer_id = ? AND seller_id = ?`,
      [product_id, buyerId, seller_id]
    );

    if (existing.length > 0) {
      return res.status(200).json({
        success: true,
        data: existing[0],
      });
    }

    // 새 채팅방 생성
    const [result] = await pool.query(
      "INSERT INTO chat_rooms (product_id, buyer_id, seller_id) VALUES (?, ?, ?)",
      [product_id, buyerId, seller_id]
    );

    const [newRoom] = await pool.query(
      `SELECT id, product_id, buyer_id, seller_id, created_at
       FROM chat_rooms WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: newRoom[0],
    });
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
    // 채팅방 참여자 확인
    const [roomRows] = await pool.query(
      "SELECT id FROM chat_rooms WHERE id = ? AND (buyer_id = ? OR seller_id = ?)",
      [chatRoomId, userId, userId]
    );
    if (roomRows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "채팅방에 접근할 권한이 없습니다.",
        error: { code: "FORBIDDEN" },
      });
    }

    // 전체 메시지 수 조회
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM messages WHERE chat_room_id = ?",
      [chatRoomId]
    );

    // 메시지 목록 조회
    const [messages] = await pool.query(
      `SELECT id, sender_id, content, is_read, created_at
       FROM messages
       WHERE chat_room_id = ?
       ORDER BY created_at ASC
       LIMIT ? OFFSET ?`,
      [chatRoomId, limit, offset]
    );

    return res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: { total, page, limit },
      },
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
    // 채팅방 참여자 확인
    const [roomRows] = await pool.query(
      "SELECT id FROM chat_rooms WHERE id = ? AND (buyer_id = ? OR seller_id = ?)",
      [chatRoomId, userId, userId]
    );
    if (roomRows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "채팅방에 접근할 권한이 없습니다.",
        error: { code: "FORBIDDEN" },
      });
    }

    // 메시지 저장
    const [result] = await pool.query(
      "INSERT INTO messages (chat_room_id, sender_id, content) VALUES (?, ?, ?)",
      [chatRoomId, userId, content.trim()]
    );

    const [[message]] = await pool.query(
      "SELECT id, chat_room_id, sender_id, content, is_read, created_at FROM messages WHERE id = ?",
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: message,
    });
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
    // 채팅방 참여자 확인
    const [roomRows] = await pool.query(
      "SELECT id FROM chat_rooms WHERE id = ? AND (buyer_id = ? OR seller_id = ?)",
      [chatRoomId, userId, userId]
    );
    if (roomRows.length === 0) {
      return res.status(403).json({
        success: false,
        message: "채팅방에 접근할 권한이 없습니다.",
        error: { code: "FORBIDDEN" },
      });
    }

    // 상대방이 보낸 읽지 않은 메시지를 읽음 처리
    const [result] = await pool.query(
      `UPDATE messages
       SET is_read = TRUE
       WHERE chat_room_id = ? AND sender_id != ? AND is_read = FALSE`,
      [chatRoomId, userId]
    );

    return res.status(200).json({
      success: true,
      message: "메시지를 읽음 처리했습니다.",
      data: { updated_count: result.affectedRows },
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

module.exports = { getChatList, createChatRoom, getMessages, saveMessage, markAsRead };
