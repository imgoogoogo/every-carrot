import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../utils/api";

function formatMsgTime(dateStr) {
  const d = new Date(dateStr);
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "오후" : "오전";
  const h = hours % 12 || 12;
  return `${ampm} ${h}:${minutes}`;
}

function getMyUserIdFromToken() {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1])).id ?? null;
  } catch {
    return null;
  }
}

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const chatRoomId = Number(id);

  // ref로 관리해야 소켓 클로저 안에서도 항상 최신값 참조 가능
  const myUserIdRef = useRef(getMyUserIdFromToken());

  const [messages, setMessages] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [input, setInput] = useState("");
  const [productBarVisible, setProductBarVisible] = useState(true);
  const [dealLoading, setDealLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const isComposingRef = useRef(false);
  const socketRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    const markRead = () => api.patch(`/api/chats/${chatRoomId}/read`).catch(() => {});

    const fetchData = async () => {
      try {
        const [chatListRes, messagesRes] = await Promise.all([
          api.get("/api/chats"),
          api.get(`/api/chats/${chatRoomId}/messages`),
        ]);

        if (chatListRes.data?.success) {
          const room = chatListRes.data.data.find((r) => r.id === chatRoomId);
          if (room) setRoomInfo(room);
        }

        if (messagesRes.data?.success) {
          const myId = myUserIdRef.current;
          const mapped = messagesRes.data.data.messages.map((m) => ({
            id: m.id,
            sender: m.sender_id === myId ? "me" : "opponent",
            text: m.content,
            time: formatMsgTime(m.created_at),
            is_read: m.is_read,
          }));
          setMessages(mapped);
        }
      } catch (err) {
        console.error("채팅방 데이터 로드 실패:", err);
      }
      markRead();
    };
    fetchData();

    if (token) {
      const socket = io("/", {
        auth: { token },
        transports: ["websocket"],
      });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join_room", { chat_room_id: chatRoomId });
      });

      socket.on("receive_message", (msg) => {
        const isMe = msg.sender_id === myUserIdRef.current;
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            sender: isMe ? "me" : "opponent",
            text: msg.content,
            time: formatMsgTime(msg.created_at),
            is_read: false,
          },
        ]);
        if (!isMe) {
          markRead();
        }
      });

      socket.on("messages_read", () => {
        setMessages((prev) =>
          prev.map((m) => (m.sender === "me" ? { ...m, is_read: true } : m))
        );
      });

      socket.on("error", (err) => console.warn("소켓 오류:", err.message));

      return () => {
        socket.emit("leave_room", { chat_room_id: chatRoomId });
        socket.disconnect();
      };
    }
  }, [chatRoomId]);

  const handleLeaveRoom = async () => {
    if (!window.confirm("채팅방을 나가면 대화 내용이 삭제됩니다. 나가시겠습니까?")) return;
    try {
      socketRef.current?.emit("leave_room", { chat_room_id: chatRoomId });
      socketRef.current?.disconnect();
      await api.delete(`/api/chats/${chatRoomId}`);
      navigate("/chat");
    } catch {
      alert("채팅방 나가기에 실패했습니다.");
    }
  };

  const handleDealComplete = async () => {
    if (!window.confirm("거래를 완료하시겠습니까?")) return;
    setDealLoading(true);
    try {
      await api.patch(`/api/products/${roomInfo.product.id}/status`, { status: "판매완료" });
      setRoomInfo((prev) => ({ ...prev, product: { ...prev.product, status: "판매완료" } }));
    } catch (err) {
      alert(err.response?.data?.message || "상태 변경에 실패했습니다.");
    } finally {
      setDealLoading(false);
    }
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    if (socketRef.current?.connected) {
      socketRef.current.emit("send_message", { chat_room_id: chatRoomId, content: text });
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

  const opponentName = roomInfo?.opponent?.nickname ?? "";
  const product = roomInfo?.product;

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
          <div className="text-[15px] font-bold text-[#222]">{opponentName || "..."}</div>
        </div>
        <div className="relative">
          <button onClick={() => setMenuOpen((v) => !v)} className="bg-transparent border-none cursor-pointer p-1 flex active:opacity-50">
            <svg width="20" height="20" fill="none" stroke="#555" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" fill="#555" />
              <circle cx="12" cy="12" r="1.5" fill="#555" />
              <circle cx="12" cy="19" r="1.5" fill="#555" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-[110]" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 bg-white rounded-[12px] shadow-lg border border-[#eee] z-[120] overflow-hidden w-[140px]">
                <button
                  onClick={() => { setMenuOpen(false); handleLeaveRoom(); }}
                  className="w-full px-4 py-3 text-left text-[14px] text-red-500 hover:bg-[#f9f9f9] active:bg-[#f5f5f5]"
                >
                  채팅방 나가기
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Product Info Bar */}
      {productBarVisible && product && (
        <div className="bg-white border-b border-[#eee] px-4 py-[10px] flex items-center gap-3 shrink-0">
          {product.image_url ? (
            <img src={product.image_url} alt={product.title} className="w-[46px] h-[46px] rounded-[8px] object-cover shrink-0" />
          ) : (
            <div className="w-[46px] h-[46px] rounded-[8px] bg-[#f0f0f0] shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-[#333] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{product.title}</div>
            <div className="mt-0.5">
              <span className="text-[10px] font-bold bg-brand text-white px-[6px] py-[1px] rounded-[3px]">{product.status}</span>
            </div>
          </div>
          {roomInfo?.is_seller && (
            <button
              onClick={handleDealComplete}
              disabled={dealLoading || product.status === "판매완료"}
              className={`border-none rounded-[8px] px-[14px] py-[7px] text-xs font-bold shrink-0 transition-transform text-white ${
                product.status === "판매완료"
                  ? "bg-[#ccc] cursor-not-allowed"
                  : dealLoading
                  ? "bg-[#ccc] cursor-not-allowed"
                  : "bg-brand-red cursor-pointer active:scale-[0.98]"
              }`}
            >
              {product.status === "판매완료" ? "거래완료" : dealLoading ? "처리 중..." : "거래 완료"}
            </button>
          )}
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
                  {opponentName.charAt(0)}
                </div>
              )}
              <div className={`flex flex-col max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                {!isMe && (i === 0 || messages[i - 1]?.sender !== "opponent") && (
                  <span className="text-xs text-[#888] mb-[3px] font-semibold">{opponentName}</span>
                )}
                <div className={`flex items-end gap-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`px-[14px] py-[10px] text-sm leading-[1.5] break-words ${
                    isMe
                      ? "bg-brand text-white rounded-[18px_18px_4px_18px]"
                      : "bg-white text-[#222] rounded-[18px_18px_18px_4px] shadow-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <div className={`flex flex-col items-end gap-0.5 shrink-0 mb-0.5 ${isMe ? "" : "items-start"}`}>
                    {isMe && !msg.is_read && <span className="text-[10px] text-brand font-bold leading-none">1</span>}
                    {showTime && <span className="text-[11px] text-[#bbb]">{msg.time}</span>}
                  </div>
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
