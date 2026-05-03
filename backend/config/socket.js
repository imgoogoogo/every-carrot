const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const chatModel = require("../models/chatModel");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  // JWT 인증 미들웨어
  io.use((socket, next) => {
    const token = (socket.handshake.auth?.token || socket.handshake.query?.token)
      ?.replace("Bearer ", "");

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
        if (!(await chatModel.isParticipant(chat_room_id, userId))) {
          socket.emit("error", { message: "채팅방에 접근할 권한이 없습니다." });
          return;
        }
        socket.join(`room_${chat_room_id}`);

        // 입장 시 상대방이 보낸 메시지 읽음 처리 후 방 전체에 알림
        const updated = await chatModel.markMessagesAsRead(chat_room_id, userId);
        if (updated > 0) {
          io.to(`room_${chat_room_id}`).emit("messages_read", { chat_room_id, reader_id: userId });
        }
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
        if (!(await chatModel.isParticipant(chat_room_id, userId))) {
          socket.emit("error", { message: "채팅방에 접근할 권한이 없습니다." });
          return;
        }

        const message = await chatModel.insertMessage(chat_room_id, userId, content.trim());
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