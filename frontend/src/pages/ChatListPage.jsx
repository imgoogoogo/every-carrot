import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const BOTTOM_TABS = [
  { name: "홈", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4", path: "/main" },
  { name: "글쓰기", icon: "M12 4v16m8-8H4", path: "/write" },
  { name: "채팅", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", path: "/chat" },
  { name: "MY", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", path: "/mypage" },
];

const now = Date.now();
const MOCK_ROOMS = [
  {
    id: 1,
    opponentName: "이승빈",
    opponentDept: "컴퓨터공학과",
    productTitle: "맥북 에어 M2 2022 스그",
    productPrice: "850,000",
    productImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=100&h=100&fit=crop",
    lastMessage: "혹시 직거래 가능하신가요?",
    lastMessageAt: now - 60 * 1000,
    unread: 2,
  },
  {
    id: 2,
    opponentName: "고영민",
    opponentDept: "전자공학과",
    productTitle: "아이패드 10세대 + 애플펜슬",
    productPrice: "380,000",
    productImage: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop",
    lastMessage: "네, 내일 오후 시간 되세요?",
    lastMessageAt: now - 13 * 60 * 1000,
    unread: 0,
  },
  {
    id: 3,
    opponentName: "김동민",
    opponentDept: "경영학과",
    productTitle: "나이키 에어포스1 270mm",
    productPrice: "45,000",
    productImage: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
    lastMessage: "사진 더 있으신가요?",
    lastMessageAt: now - 24 * 60 * 60 * 1000,
    unread: 1,
  },
];

function formatTime(ts) {
  const diff = Date.now() - new Date(ts).getTime();
  const min = Math.floor(diff / 60000);
  const hour = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (min < 1) return "방금";
  if (min < 60) return `${min}분 전`;
  if (hour < 24) return `${hour}시간 전`;
  if (day < 7) return `${day}일 전`;
  return new Date(ts).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" });
}

function mapApiRoom(row) {
  return {
    id: row.id,
    opponentName: row.opponent?.nickname ?? "상대방",
    opponentDept: "",
    productTitle: row.product?.title ?? "",
    productPrice: row.product?.price ? Number(row.product.price).toLocaleString() : "",
    productImage: row.product?.image_url ?? "",
    lastMessage: row.last_message?.content ?? "",
    lastMessageAt: row.last_message?.created_at
      ? new Date(row.last_message.created_at).getTime()
      : Date.now(),
    unread: row.unread_count ?? 0,
  };
}

export default function ChatListPage() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState(MOCK_ROOMS);
  const [activeTab, setActiveTab] = useState("채팅");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/chats");
        if (res.data?.success && Array.isArray(res.data.data)) {
          setRooms(res.data.data.map(mapApiRoom));
        }
      } catch {
        // 미로그인 or 서버 오류 → 목 데이터 유지
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleRoomClick = async (room) => {
    try {
      await api.patch(`/api/chats/${room.id}/read`);
    } catch { /* 실패해도 UI는 읽음 처리 */ }
    setRooms((prev) => prev.map((r) => (r.id === room.id ? { ...r, unread: 0 } : r)));
    navigate(`/chat/${room.id}`);
  };

  const sortedRooms = [...rooms].sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  const totalUnread = rooms.reduce((sum, r) => sum + r.unread, 0);

  return (
    <div className="w-full bg-[#FAFAFA] min-h-full font-app flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-[#eee] px-[18px] py-[14px] flex items-center sticky top-0 z-[100]">
        <span className="text-[17px] font-bold text-[#222]">채팅</span>
      </div>

      {/* Chat List */}
      <div className="flex-1 pb-[80px]">
        {loading ? (
          <div className="text-center py-20 text-[#bbb] text-sm">불러오는 중...</div>
        ) : sortedRooms.length === 0 ? (
          <div className="text-center px-5 py-20 text-[#999]">
            <div className="text-[44px] mb-[14px]">💬</div>
            <div className="text-[15px] font-semibold">채팅 내역이 없습니다</div>
            <div className="text-[13px] mt-[6px]">물품을 구경하고 채팅을 시작해보세요</div>
          </div>
        ) : (
          sortedRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className="flex items-center gap-[14px] px-[18px] py-[14px] bg-white border-b border-[#f5f5f5] cursor-pointer active:bg-[#f9f9f9] transition-colors"
            >
              <div className="relative shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-red to-brand flex items-center justify-center text-lg font-bold text-white">
                  {room.opponentName.charAt(0)}
                </div>
                {room.unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] bg-[#FF4D4F] rounded-full text-[11px] font-bold text-white border-2 border-white flex items-center justify-center">
                    {room.unread}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-[3px]">
                  <div className="flex items-center gap-[5px]">
                    <span className="text-sm font-bold text-[#222]">{room.opponentName}</span>
                    {room.opponentDept && (
                      <span className="text-xs text-[#aaa]">{room.opponentDept}</span>
                    )}
                  </div>
                  <span className="text-xs text-[#bbb] shrink-0">{formatTime(room.lastMessageAt)}</span>
                </div>
                <div className={`text-sm overflow-hidden text-ellipsis whitespace-nowrap mb-[5px] ${
                  room.unread > 0 ? "font-medium text-[#333]" : "font-normal text-[#888]"
                }`}>
                  {room.lastMessage || "대화를 시작해보세요"}
                </div>
                {room.productTitle && (
                  <div className="flex items-center gap-[6px] bg-[#f8f8f8] rounded-[6px] px-2 py-1 w-fit max-w-full">
                    {room.productImage && (
                      <img src={room.productImage} alt={room.productTitle} className="w-5 h-5 rounded-[3px] object-cover shrink-0" />
                    )}
                    <span className="text-[11px] text-[#666] overflow-hidden text-ellipsis whitespace-nowrap">{room.productTitle}</span>
                    {room.productPrice && (
                      <span className="text-[11px] text-brand font-bold shrink-0">{room.productPrice}원</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] flex justify-around pt-2.5 pb-6 z-[110] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {BOTTOM_TABS.map((tab) => (
          <button
            key={tab.name}
            onClick={() => { setActiveTab(tab.name); navigate(tab.path); }}
            className="flex flex-col items-center gap-1.5 px-4 relative flex-1 active:scale-95 transition-transform"
          >
            <svg width="24" height="24" fill="none" stroke={activeTab === tab.name ? "#555" : "#ccc"} strokeWidth="2.2" viewBox="0 0 24 24">
              <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`text-[13px] ${activeTab === tab.name ? "font-bold text-brand-red" : "font-medium text-[#bbb]"}`}>
              {tab.name}
            </span>
            {tab.name === "채팅" && totalUnread > 0 && (
              <span className="absolute top-[-2px] right-[28%] w-[15px] h-[15px] bg-[#FF4D4F] rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-white">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
