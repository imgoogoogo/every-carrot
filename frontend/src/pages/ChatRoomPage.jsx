import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../utils/api";

const MOCK_ROOM = {
  opponentName: "이승빈",
  opponentDept: "컴퓨터공학과",
  product: {
    title: "맥북 에어 M2 2022 스그",
    price: "850,000",
    status: "판매중",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&h=200&fit=crop",
  },
};

const MOCK_MESSAGES = [
  { id: 1, sender: "opponent", text: "안녕하세요! 맥북 아직 판매 중인가요?", time: "오후 2:14" },
  { id: 2, sender: "me", text: "네, 판매 중이에요 😊", time: "오후 2:15" },
  { id: 3, sender: "opponent", text: "혹시 직거래 가능하신가요?", time: "오후 2:16" },
  { id: 4, sender: "me", text: "당연하죠! 어디가 편하세요?", time: "오후 2:17" },
  { id: 5, sender: "opponent", text: "학생회관 카페 어떠세요?", time: "오후 2:18" },
];

function formatMsgTime(dateStr) {
  const d = new Date(dateStr);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "오후" : "오전";
  const h = hours % 12 || 12;
  return `${ampm} ${h}:${minutes}`;
}

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const chatRoomId = Number(id);

  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [roomInfo, setRoomInfo] = useState(MOCK_ROOM);
  const [input, setInput] = useState("");
  const [productBarVisible, setProductBarVisible] = useState(true);
  const [myUserId, setMyUserId] = useState(null);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const isComposingRef = useRef(false);
  const socketRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    // 이전 메시지 로드
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/api/chats/${chatRoomId}/messages`);
        if (res.data?.success && Array.isArray(res.data.data?.messages)) {
          const userId = res.data.data?.myUserId ?? null;
          setMyUserId(userId);
          const mapped = res.data.data.messages.map((m) => ({
            id: m.id,
            sender: m.sender_id === userId ? "me" : "opponent",
            text: m.content,
            time: formatMsgTime(m.created_at),
          }));
          if (mapped.length > 0) setMessages(mapped);
        }
      } catch { /* 비로그인 → 목 데이터 유지 */ }
    };
    fetchMessages();

    // Socket.io 연결
    if (token) {
      const socket = io("http://localhost:3000", {
        auth: { token },
        transports: ["websocket"],
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join_room", { chat_room_id: chatRoomId });
      });

      socket.on("receive_message", (msg) => {
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            sender: msg.sender_id === myUserId ? "me" : "opponent",
            text: msg.content,
            time: formatMsgTime(msg.created_at),
          },
        ]);
      });

      socket.on("error", (err) => console.warn("소켓 오류:", err.message));

      return () => {
        socket.emit("leave_room", { chat_room_id: chatRoomId });
        socket.disconnect();
      };
    }
  }, [chatRoomId]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit("send_message", { chat_room_id: chatRoomId, content: text });
    } else {
      const now = new Date();
      const hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const ampm = hours >= 12 ? "오후" : "오전";
      const h = hours % 12 || 12;
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "me", text, time: `${ampm} ${h}:${minutes}` },
      ]);
    }
    setInput("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full h-full bg-[#FAFAFA] font-app flex flex-col overflow-hidden">

      {/* Header */}
      <div className="bg-white border-b border-[#eee] px-4 py-3 flex items-center gap-[10px] sticky top-0 z-[100] shrink-0">
        <button onClick={() => navigate("/chat")} className="bg-transparent border-none cursor-pointer p-1 flex active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="text-[15px] font-bold text-[#222]">{roomInfo.opponentName}</div>
          <div className="text-xs text-[#aaa]">{roomInfo.opponentDept}</div>
        </div>
        <button className="bg-transparent border-none cursor-pointer p-1 flex active:opacity-50">
          <svg width="20" height="20" fill="none" stroke="#555" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" fill="#555" />
            <circle cx="12" cy="12" r="1.5" fill="#555" />
            <circle cx="12" cy="19" r="1.5" fill="#555" />
          </svg>
        </button>
      </div>

      {/* Product Info Bar */}
      {productBarVisible && (
        <div className="bg-white border-b border-[#eee] px-4 py-[10px] flex items-center gap-3 shrink-0">
          <img src={roomInfo.product.image} alt={roomInfo.product.title} className="w-[46px] h-[46px] rounded-[8px] object-cover shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-[#333] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{roomInfo.product.title}</div>
            <div className="flex items-center gap-[6px] mt-0.5">
              <span className="text-[10px] font-bold bg-brand text-white px-[6px] py-[1px] rounded-[3px]">{roomInfo.product.status}</span>
              <span className="text-[13px] font-bold text-brand">{roomInfo.product.price}원</span>
            </div>
          </div>
          <button className="bg-brand-red text-white border-none rounded-[8px] px-[14px] py-[7px] text-xs font-bold cursor-pointer shrink-0 active:scale-[0.98] transition-transform">
            거래 완료
          </button>
          <button onClick={() => setProductBarVisible(false)} className="bg-transparent border-none cursor-pointer p-1 shrink-0">
            <svg width="16" height="16" fill="none" stroke="#bbb" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex items-center gap-[10px] my-2 mb-[14px]">
          <div className="flex-1 h-px bg-[#e8e8e8]" />
          <span className="text-xs text-[#bbb] whitespace-nowrap">오늘</span>
          <div className="flex-1 h-px bg-[#e8e8e8]" />
        </div>

        {messages.map((msg, i) => {
          const isMe = msg.sender === "me";
          const showTime = i === messages.length - 1 || messages[i + 1]?.sender !== msg.sender;
          return (
            <div key={msg.id} className={`flex items-end gap-[6px] mb-0.5 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-red to-brand flex items-center justify-center text-[13px] font-bold text-white shrink-0 self-start">
                  {roomInfo.opponentName.charAt(0)}
                </div>
              )}
              <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && (i === 0 || messages[i - 1]?.sender !== "opponent") && (
                  <span className="text-xs text-[#888] mb-[3px] font-semibold">{roomInfo.opponentName}</span>
                )}
                <div className={`flex items-end gap-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`px-[14px] py-[10px] text-sm leading-[1.5] break-words ${
                    isMe
                      ? "bg-brand text-white rounded-[18px_18px_4px_18px]"
                      : "bg-white text-[#222] rounded-[18px_18px_18px_4px] shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                  {showTime && <span className="text-[11px] text-[#bbb] shrink-0 mb-0.5">{msg.time}</span>}
                </div>
              </div>
              {isMe && <div className="w-8 shrink-0" />}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="bg-white border-t border-[#eee] px-3 py-[10px] flex items-end gap-2 shrink-0">
        <button className="bg-transparent border-none cursor-pointer p-[6px] flex shrink-0 active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#aaa" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" />
          </svg>
        </button>
        <div className="flex-1 bg-[#f5f5f5] rounded-[22px] px-4 py-[10px] flex items-center">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onCompositionStart={() => { isComposingRef.current = true; }}
            onCompositionEnd={() => { isComposingRef.current = false; }}
            onKeyDown={handleKeyDown}
            placeholder="메시지 보내기"
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#222] resize-none max-h-[100px] leading-[1.5] font-app"
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className={`w-10 h-10 rounded-full border-none flex items-center justify-center shrink-0 transition-all ${
            input.trim() ? "bg-brand cursor-pointer active:scale-90" : "bg-[#e0e0e0] cursor-not-allowed"
          }`}
        >
          <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
