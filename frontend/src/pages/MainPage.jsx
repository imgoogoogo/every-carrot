import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../api(test)/productService";

const CATEGORIES = ["전체", "전자기기", "도서", "의류/패션", "생활용품", "기타"];

const StatusBadge = ({ status }) => {
  const bgColors = { 
    판매중: "bg-brand",     
    예약중: "bg-brand-red", 
    판매완료: "bg-[#ccc]" 
  };
  const textColors = {
    판매중: "text-white",
    예약중: "text-white",    
    판매완료: "text-white"
  };

  return (
    <span className={`${bgColors[status]} ${textColors[status]} text-[10px] font-bold px-2 py-[2.5px] rounded-[4px] tracking-wide shadow-sm`}>
      {status}
    </span>
  );
};

export default function MainPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("전체");
  const [activeTab, setActiveTab] = useState("홈");

  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef(null);
  const [isDrag, setIsDrag] = useState(false);
  const [startX, setStartX] = useState(0);

  const onDragStart = (e) => {
    e.preventDefault();
    setIsDrag(true);
    setStartX(e.pageX + scrollRef.current.scrollLeft);
  };
  const onDragEnd = () => setIsDrag(false);
  const onDragMove = (e) => {
    if (!isDrag) return;
    scrollRef.current.scrollLeft = startX - e.pageX;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        const params = {
          category_id: activeCategory === "전체" ? null : CATEGORIES.indexOf(activeCategory),
          sort: "latest"
        };
        
        const data = await getProducts(params);
        setProducts(data.products); 
      } catch (err) {
        console.error("물품 목록 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const tabs = [
    { name: "홈", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4", path: "/main" },
    { name: "글쓰기", icon: "M12 4v16m8-8H4", path: "/write" }, 
    { name: "채팅", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", path: "/chat" },
    { name: "MY", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", path: "/mypage" },
  ];

  return (
    <div className="max-w-[430px] mx-auto bg-[#FAFAFA] min-h-screen font-app relative flex flex-col pb-[80px]">
      
      <div className="bg-gradient-to-r from-brand-red to-brand px-[18px] py-[16px] sticky top-0 z-[100] shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[22px] font-black text-white tracking-tighter">에브리당근</span>
            <span className="text-[10px] text-white/90 bg-white/25 px-2 py-0.5 rounded-full font-bold">동국대 WISE</span>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onMouseDown={onDragStart}
        onMouseLeave={onDragEnd}
        onMouseUp={onDragEnd}
        onMouseMove={onDragMove}
        className="flex gap-2 px-[18px] py-4 bg-white border-b border-[#eee] overflow-x-auto [&::-webkit-scrollbar]:hidden select-none cursor-grab active:cursor-grabbing"
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-[8px] rounded-full text-[13.5px] whitespace-nowrap transition-all ${
              activeCategory === cat ? "bg-brand text-white font-bold shadow-md" : "bg-white text-[#666] font-medium border border-[#eee]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="py-20 text-center text-[#999]">물품을 불러오는 중입니다...</div>
        ) : products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/products/${product.id}`)}
              className={`flex gap-[16px] px-[18px] py-5 bg-white border-b border-[#f5f5f5] cursor-pointer active:bg-gray-50 transition-colors ${product.status === "판매완료" ? "opacity-60" : ""}`}
            >
              <div className="relative shrink-0">
                <img 
                  src={product.image_url} 
                  alt={product.title} 
                 className="w-[115px] h-[115px] rounded-[12px] object-cover bg-[#f9f9f9]" 
                />
                <div className="absolute top-[2px] left-[7px]"> <StatusBadge status={product.status} /> </div>
              </div>
              
              <div className="flex flex-1 flex-col justify-between py-1 items-start text-left">
                <div className="w-full">
                  <div className="text-[16px] font-bold text-[#222] truncate mb-1">{product.title}</div>
                  <div className="text-[12.5px] text-[#999]">
                    {product.seller?.nickname} · {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-[18px] font-black text-brand tracking-tight">
                  {product.price?.toLocaleString()}원 
                </div>
                <div className="flex justify-end items-center gap-1 w-full mt-1">
                  <svg width="14" height="14" fill="none" stroke="#bbb" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[12px] text-[#bbb] font-medium">0</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-[#999]">등록된 물품이 없습니다.</div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] flex justify-around pt-2.5 pb-6 z-[110] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => { setActiveTab(tab.name); navigate(tab.path); }}
            className="flex flex-col items-center gap-1.5 px-4 relative flex-1 active:scale-95 transition-transform"
          >
            <svg 
              width="24" 
              height="24" 
              fill="none" 
              stroke={activeTab === tab.name ? "#555" : "#ccc"} 
              strokeWidth="2.2" 
              viewBox="0 0 24 24"
            >
              <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`text-[13px] ${activeTab === tab.name ? "font-bold text-brand-red" : "font-medium text-[#bbb]"}`}>
              {tab.name}
            </span>
            {tab.name === "채팅" && <span className="absolute top-[-2px] right-[28%] w-[15px] h-[15px] bg-[#FF4D4F] rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-white">1</span>}
          </button>
        ))}
      </div>
    </div>
  );
}