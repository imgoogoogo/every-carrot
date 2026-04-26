import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const bgColors = {
    판매중: "bg-brand",
    예약중: "bg-brand-red",
    판매완료: "bg-[#ccc]",
  };
  return (
    <span className={`${bgColors[status]} text-white text-[13px] font-bold px-3 py-[3px] rounded-[6px] tracking-wide shadow-sm`}>
      {status}
    </span>
  );
};

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);

  const product = {
    id: 1,
    title: "맥북 에어 M2 2022 스그",
    category: "전자기기",
    time: "3분 전",
    price: "850,000",
    status: "판매중",
    seller: {
      name: "김철수",
      dept: "컴퓨터공학과",
      avatar: "김", 
    },
    content: "상태 아주 깨끗합니다. 캠퍼스 내 직거래 선호해요.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
  };

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col relative font-app pb-[80px]">
      
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-[100] border-b border-[#eee] w-full">
        <button onClick={() => navigate(-1)} className="p-1 active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="p-1 active:opacity-50">
          <svg width="24" height="24" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v.01M12 12v.01M12 19v.01" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar w-full">
        <div className="w-full aspect-[4/3] bg-gray-100 relative">
          <img src={product.image} className="w-full h-full object-cover" alt="상품 이미지" />
          <div className="absolute top-4 left-4">
            <StatusBadge status={product.status} />
          </div>
        </div>

        <div className="w-full px-[18px] pt-3 pb-0 flex items-center gap-3">
          <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center text-white font-bold text-lg">
            {product.seller.avatar}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <div className="text-[15px] font-bold text-[#222]">{product.seller.name}</div>
            <div className="text-[12px] text-[#888]">{product.seller.dept}</div>
          </div>
        </div>

        <div className="w-full px-[18px] pt-0 pb-8 text-left flex flex-col items-start">
          <div className="w-full h-[1px] bg-[#f5f5f5] my-4"></div> 
  
          <h1 className="text-[22px] font-bold text-[#222] mb-1 mt-0 leading-tight">
            {product.title}
          </h1>

          <div className="text-[12px] text-[#aaa] mb-2">
            {product.category} · {product.time}
          </div>

          <div className="text-[22px] font-black text-brand tracking-tight mb-5">
            {product.price}원
          </div>

          <p className="text-[15px] text-[#333] leading-relaxed whitespace-pre-wrap w-full text-left">
            {product.content}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] px-[18px] py-3 flex items-center gap-4 z-[110] shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="pr-4 border-r border-[#eee] active:scale-90 transition-transform"
        >
          <svg
            width="26"
            height="26"
            fill={isLiked ? "#E94E1B" : "none"} 
            stroke={isLiked ? "#E94E1B" : "#aaa"}
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button className="flex-1 bg-brand-red text-white py-4 rounded-[12px] font-bold text-[16px] active:scale-[0.98] transition-transform shadow-md">
          채팅하기
        </button>
      </div>
    </div>
  );
}