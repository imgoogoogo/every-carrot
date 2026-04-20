import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("MY");

  const tabs = [
    { name: "홈", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4", path: "/main" },
    { name: "글쓰기", icon: "M12 4v16m8-8H4", path: "/write" },
    { name: "채팅", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", path: "/chat" },
    { name: "MY", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", path: "/mypage" },
  ];

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen font-app flex flex-col pb-[70px]">
      
      <div className="w-full px-[18px] py-[14px] font-bold text-[17px] border-b border-[#eee] sticky top-0 bg-white z-[100] text-center">
        마이페이지
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar w-full">
        {/* Profile Section */}
        <div className="px-[18px] py-6 flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center text-white text-2xl font-bold">
            김
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-start text-left">
            <div className="text-[18px] font-bold text-[#222]">김철수</div>
            <div className="text-[13px] text-[#888] mt-0.5">동국대 WISE · 컴퓨터공학과</div>
          </div>
          
          <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-md text-[12px] font-bold text-[#555] active:bg-gray-200 shrink-0">
            프로필 수정
          </button>
        </div>

        {/* Menu List */}
        <div className="border-t-[8px] border-[#f9f9f9]">
          <div className="px-[18px] py-4 border-b border-[#f5f5f5] flex justify-between items-center cursor-pointer active:bg-gray-50">
            <span className="font-medium text-[#333]">판매내역</span>
            <span className="text-[#ccc]">{">"}</span>
          </div>
          <div className="px-[18px] py-4 border-b border-[#f5f5f5] flex justify-between items-center cursor-pointer active:bg-gray-50">
            <span className="font-medium text-[#333]">구매내역</span>
            <span className="text-[#ccc]">{">"}</span>
          </div>
          <div className="px-[18px] py-4 border-b border-[#f5f5f5] flex justify-between items-center cursor-pointer active:bg-gray-50">
            <span className="font-medium text-[#333]">관심목록</span>
            <span className="text-[#ccc]">{">"}</span>
          </div>
          <div 
            onClick={() => navigate("/login")}
            className="px-[18px] py-4 flex justify-between items-center cursor-pointer active:bg-gray-50 text-red-500"
          >
            <span className="font-medium">로그아웃</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] flex justify-around pt-2 pb-4 z-[100]">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => {
              setActiveTab(tab.name);
              navigate(tab.path);
            }}
            className="flex flex-col items-center gap-1 px-4 relative flex-1"
          >
            <svg 
              width="22" 
              height="22" 
              fill="none" 
              stroke={activeTab === tab.name ? "#5B2C8E" : "#aaa"} 
              strokeWidth="2" 
              viewBox="0 0 24 24"
            >
              <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`text-[11px] ${activeTab === tab.name ? "font-bold text-brand" : "font-medium text-[#aaa]"}`}>
              {tab.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}