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

module.exports = { getChatList };
