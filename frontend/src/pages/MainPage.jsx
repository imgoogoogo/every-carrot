import { useState } from "react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = ["전체", "전자기기", "도서", "의류/패션", "생활용품", "기타"];

const PRODUCTS = [
  { id: 1, title: "맥북 에어 M2 2022 스그", department: "컴퓨터공학과", time: "3분 전", price: "850,000", hearts: 12, status: "판매중", category: "전자기기", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300" },
  { id: 2, title: "운영체제 10판 교재 (깨끗)", department: "컴퓨터공학과", time: "25분 전", price: "15,000", hearts: 4, status: "판매중", category: "도서", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300" },
  { id: 3, title: "자취 미니 전기밥솥 3인용", department: "경영학과", time: "1시간 전", price: "25,000", hearts: 8, status: "예약중", category: "생활용품", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=300" },
  { id: 4, title: "나이키 에어포스1 270mm", department: "전자공학과", time: "2시간 전", price: "45,000", hearts: 15, status: "판매중", category: "의류/패션", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300" },
  { id: 5, title: "아이패드 10세대 + 애플펜슬", department: "디자인학과", time: "3시간 전", price: "380,000", hearts: 22, status: "판매중", category: "전자기기", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300" },
  { id: 6, title: "이케아 책상 스탠딩 겸용", department: "건축학과", time: "5시간 전", price: "55,000", hearts: 6, status: "판매완료", category: "생활용품", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=300" },
];

const StatusBadge = ({ status }) => {
  const bgColors = { 판매중: "bg-brand", 예약중: "bg-[#F5A623]", 판매완료: "bg-[#ccc]" };
  return (
    <span className={`${bgColors[status]} text-white text-[11px] font-bold px-2 py-[2px] rounded-[4px] tracking-wide`}>
      {status}
    </span>
  );
};

export default function MainPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState("홈");

  const filtered = PRODUCTS.filter(p => activeCategory === "전체" || p.category === activeCategory);

  const tabs = [
    { name: "홈", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4", path: "/" },
    { name: "채팅", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", path: "#" },
    { name: "MY", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", path: "/mypage" },
  ];

  return (
    <div className="max-w-[430px] mx-auto bg-[#FAFAFA] min-h-screen font-app relative flex flex-col pb-[70px]">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-brand to-brand-soft px-[18px] py-[14px] sticky top-0 z-[100] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[22px] font-extrabold text-white tracking-tight">🥕 에브리당근</span>
            <span className="text-[11px] text-white/90 bg-white/20 px-2 py-0.5 rounded-full font-medium">동국대 WISE</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-2 px-[18px] py-3 overflow-x-auto bg-white border-b border-[#eee] no-scrollbar">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-[6px] rounded-full text-[13px] whitespace-nowrap transition-colors ${
              activeCategory === cat ? "bg-brand text-white font-bold border-none" : "bg-white text-[#555] font-medium border border-[#ddd]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.map((product) => (
          <div
            key={product.id}
            onClick={() => navigate(`/products/${product.id}`)}
            className={`flex gap-[14px] px-[18px] py-4 bg-white border-b border-[#f5f5f5] cursor-pointer active:bg-gray-50 transition-colors ${product.status === "판매완료" ? "opacity-50" : ""}`}
          >
            <div className="relative shrink-0">
              <img src={product.image} alt={product.title} className="w-[110px] h-[110px] rounded-[10px] object-cover bg-[#eee]" />
              <div className="absolute top-1.5 left-1.5"><StatusBadge status={product.status} /></div>
            </div>
            
            <div className="flex flex-1 flex-col justify-between min-w-0 py-1">
              <div>
                <div className="text-[15px] font-bold text-[#222] truncate mb-1">{product.title}</div>
                <div className="text-[12px] text-[#999]">{product.department} · {product.time}</div>
              </div>
              <div className="text-[17px] font-extrabold text-brand tracking-tight">{product.price}원</div>
              <div className="flex justify-end items-center gap-1">
                <svg width="14" height="14" fill="none" stroke="#aaa" strokeWidth="1.5" viewBox="0 0 24 24"><path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <span className="text-[12px] text-[#aaa]">{product.hearts}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FAB - 글쓰기 */}
      <button className="fixed bottom-[80px] right-[max(16px,calc(50%-200px))] bg-gradient-to-br from-brand to-brand-soft text-white rounded-full px-5 py-3 text-[15px] font-bold shadow-[0_4px_16px_rgba(91,44,142,0.35)] flex items-center gap-2 z-[90] active:scale-95 transition-transform">
        <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M12 4v16m8-8H4" strokeLinecap="round" /></svg>
        글쓰기
      </button>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] flex justify-around pt-2 pb-4 z-[100]">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => { setActiveTab(tab.name); navigate(tab.path); }}
            className="flex flex-col items-center gap-1 px-4 relative"
          >
            <svg width="22" height="22" fill="none" stroke={activeTab === tab.name ? "#5B2C8E" : "#aaa"} strokeWidth="2" viewBox="0 0 24 24">
              <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`text-[11px] ${activeTab === tab.name ? "font-bold text-brand" : "font-medium text-[#aaa]"}`}>{tab.name}</span>
            {tab.name === "채팅" && <span className="absolute top-0 right-3 w-4 h-4 bg-[#E74C3C] rounded-full text-[10px] font-bold text-white flex items-center justify-center">1</span>}
          </button>
        ))}
      </div>
    </div>
  );
}