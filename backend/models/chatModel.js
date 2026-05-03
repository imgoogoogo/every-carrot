const pool = require("../config/db");

async function getChatListByUserId(userId) {
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
       (cr.seller_id = ?)                                      AS is_seller,
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
     LEFT JOIN messages lm ON lm.id = (
       SELECT id FROM messages
       WHERE  chat_room_id = cr.id
       ORDER  BY created_at DESC, id DESC
       LIMIT  1
     )
     WHERE cr.buyer_id = ? OR cr.seller_id = ?
     ORDER BY lm.created_at IS NULL ASC,
              lm.created_at DESC`,
    [userId, userId, userId, userId, userId, userId, userId]
  );
  return rows;
}

async function findProductBySeller(productId, sellerId) {
  const [rows] = await pool.query(
    "SELECT id FROM products WHERE id = ? AND seller_id = ?",
    [productId, sellerId]
  );
  return rows[0] || null;
}

async function findExistingRoom(productId, buyerId, sellerId) {
  const [rows] = await pool.query(
    `SELECT id, product_id, buyer_id, seller_id, created_at
     FROM chat_rooms
     WHERE product_id = ? AND buyer_id = ? AND seller_id = ?`,
    [productId, buyerId, sellerId]
  );
  return rows[0] || null;
}

async function createRoom(productId, buyerId, sellerId) {
  const [result] = await pool.query(
    "INSERT INTO chat_rooms (product_id, buyer_id, seller_id) VALUES (?, ?, ?)",
    [productId, buyerId, sellerId]
  );
  const [rows] = await pool.query(
    "SELECT id, product_id, buyer_id, seller_id, created_at FROM chat_rooms WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
}

async function isParticipant(chatRoomId, userId) {
  const [rows] = await pool.query(
    "SELECT id FROM chat_rooms WHERE id = ? AND (buyer_id = ? OR seller_id = ?)",
    [chatRoomId, userId, userId]
  );
  return rows.length > 0;
}

async function countMessages(chatRoomId) {
  const [[{ total }]] = await pool.query(
    "SELECT COUNT(*) AS total FROM messages WHERE chat_room_id = ?",
    [chatRoomId]
  );
  return total;
}

async function getMessageList(chatRoomId, limit, offset) {
  const [rows] = await pool.query(
    `SELECT id, sender_id, content, is_read, created_at
     FROM messages
     WHERE chat_room_id = ?
     ORDER BY created_at ASC
     LIMIT ? OFFSET ?`,
    [chatRoomId, limit, offset]
  );
  return rows;
}

async function insertMessage(chatRoomId, senderId, content) {
  const [result] = await pool.query(
    "INSERT INTO messages (chat_room_id, sender_id, content) VALUES (?, ?, ?)",
    [chatRoomId, senderId, content]
  );
  const [[message]] = await pool.query(
    `SELECT m.id, m.chat_room_id, m.sender_id, u.nickname AS sender_nickname,
            m.content, m.is_read, m.created_at
     FROM messages m
     JOIN users u ON u.id = m.sender_id
     WHERE m.id = ?`,
    [result.insertId]
  );
  return message;
}

async function deleteRoom(chatRoomId) {
  await pool.query("DELETE FROM chat_rooms WHERE id = ?", [chatRoomId]);
}

async function markMessagesAsRead(chatRoomId, userId) {
  const [result] = await pool.query(
    `UPDATE messages
     SET is_read = TRUE
     WHERE chat_room_id = ? AND sender_id != ? AND is_read = FALSE`,
    [chatRoomId, userId]
  );
  return result.affectedRows;
}

module.exports = {
  getChatListByUserId,
  findProductBySeller,
  findExistingRoom,
  createRoom,
  isParticipant,
  countMessages,
  getMessageList,
  insertMessage,
  deleteRoom,
  markMessagesAsRead,
};