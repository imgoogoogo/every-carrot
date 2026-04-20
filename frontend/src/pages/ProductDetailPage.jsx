import { useNavigate } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const bgColors = {
    판매중: "bg-brand",
    예약중: "bg-[#F5A623]",
    판매완료: "bg-[#ccc]",
  };
  return (
    <span
      className={`${bgColors[status]} text-white text-[11px] font-bold px-2 py-[2px] rounded-[4px] tracking-wide`}
    >
      {status}
    </span>
  );
};

export default function ProductDetailPage() {
  const navigate = useNavigate();

  // 테스트를 위한 임시 데이터 (나중에 DB 연동)
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
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
  };

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col relative font-app pb-[100px]">
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-[100] border-b border-[#eee] w-full">
        <button onClick={() => navigate(-1)} className="p-1 active:opacity-50">
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="#333"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="w-8"></div> 
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar w-full">
        {/* Product Image */}
        <div className="w-full aspect-square bg-gray-100 relative">
          <img
            src={product.image}
            className="w-full h-full object-cover"
            alt="상품 이미지"
          />
          <div className="absolute top-4 left-4">
            <StatusBadge status={product.status} />
          </div>
        </div>

        <div className="w-full px-[18px] py-4 flex items-center gap-3 border-b border-[#f5f5f5]">
          <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center text-white font-bold text-lg">
            {product.seller.avatar}
          </div>
          <div className="flex-1 flex flex-col items-start">
            <div className="text-[15px] font-bold text-[#222]">
              {product.seller.name}
            </div>
            <div className="text-[12px] text-[#888]">
              {product.seller.dept}
            </div>
          </div>
        </div>

        <div className="w-full px-[18px] py-5 text-left flex flex-col items-start">
          <h1 className="text-[20px] font-bold text-[#222] mb-1">
            {product.title}
          </h1>
          <div className="text-[12px] text-[#aaa] mb-4">
            {product.category} · {product.time}
          </div>
          <p className="text-[15px] text-[#333] leading-relaxed whitespace-pre-wrap w-full text-left">
            {product.content}
          </p>
          
        </div>
      </div>

      {/* Bottom Fixed Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] px-[18px] py-3 flex items-center gap-4 z-[110]">
        
        <button className="pr-4 border-r border-[#eee] active:opacity-50 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#aaa"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="flex-1 font-extrabold text-[18px] text-left text-brand tracking-tight">
          {product.price}원
        </div>
        <button className="bg-brand text-white px-6 py-3 rounded-[10px] font-bold text-[15px] active:opacity-80 shrink-0">
          채팅하기
        </button>
      </div>
    </div>
  );
}