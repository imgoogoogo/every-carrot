const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const pool = require("./db");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  // JWT 인증 미들웨어
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token?.replace("Bearer ", "");
    if (!token) {
      return next(new Error("인증 토큰이 필요합니다."));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch {
      next(new Error("유효하지 않은 토큰입니다."));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;

    // 채팅방 입장
    socket.on("join_room", async ({ chat_room_id }) => {
      try {
        const [rows] = await pool.query(
          "SELECT id FROM chat_rooms WHERE id = ? AND (buyer_id = ? OR seller_id = ?)",
          [chat_room_id, userId, userId]
        );
        if (rows.length === 0) {
          socket.emit("error", { message: "채팅방에 접근할 권한이 없습니다." });
          return;
        }
        socket.join(`room_${chat_room_id}`);
      } catch (err) {
        console.error("join_room 오류:", err);
        socket.emit("error", { message: "서버 오류가 발생했습니다." });
      }
    });

    // 메시지 전송
    socket.on("send_message", async ({ chat_room_id, content }) => {
      if (!content || typeof content !== "string" || content.trim() === "") {
        socket.emit("error", { message: "메시지 내용을 입력해주세요." });
        return;
      }
      if (content.length > 1000) {
        socket.emit("error", { message: "메시지는 최대 1000자까지 입력 가능합니다." });
        return;
      }

      try {
        // 채팅방 참여자 확인
        const [rows] = await pool.query(
          "SELECT id FROM chat_rooms WHERE id = ? AND (buyer_id = ? OR seller_id = ?)",
          [chat_room_id, userId, userId]
        );
        if (rows.length === 0) {
          socket.emit("error", { message: "채팅방에 접근할 권한이 없습니다." });
          return;
        }

        // DB 저장
        const [result] = await pool.query(
          "INSERT INTO messages (chat_room_id, sender_id, content) VALUES (?, ?, ?)",
          [chat_room_id, userId, content.trim()]
        );
        const [[message]] = await pool.query(
          "SELECT id, chat_room_id, sender_id, content, is_read, created_at FROM messages WHERE id = ?",
          [result.insertId]
        );

        // 룸의 모든 클라이언트에게 브로드캐스트
        io.to(`room_${chat_room_id}`).emit("receive_message", message);
      } catch (err) {
        console.error("send_message 오류:", err);
        socket.emit("error", { message: "서버 오류가 발생했습니다." });
      }
    });

    // 채팅방 퇴장
    socket.on("leave_room", ({ chat_room_id }) => {
      socket.leave(`room_${chat_room_id}`);
    });
  });

  return io;
}

module.exports = initSocket;
