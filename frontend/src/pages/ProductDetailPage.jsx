import { useNavigate } from "react-router-dom";

export default function ProductDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-screen font-app flex flex-col relative">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-[100] border-b border-[#eee]">
        <button onClick={() => navigate(-1)} className="p-1 active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div className="flex gap-3 text-xl">
          <button>📤</button>
          <button>···</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-[100px] no-scrollbar">
        {/* Product Image */}
        <div className="w-full aspect-square bg-gray-100">
          <img 
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600" 
            className="w-full h-full object-cover"
            alt="상품 이미지"
          />
        </div>

        {/* Seller Info */}
        <div className="px-[18px] py-4 flex items-center gap-3 border-b border-[#f5f5f5]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center text-white font-bold text-lg">
            이
          </div>
          <div className="flex-1">
            <div className="text-[15px] font-bold text-[#222]">이승빈</div>
            <div className="text-[12px] text-[#888]">컴퓨터공학과</div>
          </div>
          <div className="text-right">
            <div className="text-brand font-bold text-[16px]">36.5℃</div>
            <div className="text-[10px] text-[#aaa] underline">매너온도</div>
          </div>
        </div>

        {/* Content */}
        <div className="px-[18px] py-5">
          <h1 className="text-[20px] font-bold text-[#222] mb-2">맥북 에어 M2 2022 스그</h1>
          <div className="text-[12px] text-[#aaa] mb-4">전자기기 · 3분 전</div>
          <p className="text-[15px] text-[#333] leading-relaxed whitespace-pre-wrap">
            상태 아주 깨끗합니다. 캠퍼스 내 직거래 선호해요.
          </p>
          <div className="mt-8 text-[13px] text-[#aaa]">관심 12 · 채팅 2 · 조회 145</div>
        </div>
      </div>

      {/* Bottom Fixed Bar */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] px-[18px] py-3 flex items-center gap-4">
        <button className="pr-4 border-r border-[#eee] grayscale">❤️</button>
        <div className="flex-1 font-bold text-[18px]">850,000원</div>
        <button className="bg-brand text-white px-6 py-3 rounded-[10px] font-bold active:opacity-80">
          채팅하기
        </button>
      </div>
    </div>
  );
}