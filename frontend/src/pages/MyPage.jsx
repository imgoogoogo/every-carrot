export default function MyPage() {
  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-screen font-app flex flex-col">
      <div className="px-[18px] py-[14px] font-bold text-[17px] border-b border-[#eee]">나의 당근</div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Profile Section */}
        <div className="px-[18px] py-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center text-white text-2xl font-bold">이</div>
          <div className="flex-1">
            <div className="text-[18px] font-bold">이승빈</div>
            <div className="text-[13px] text-[#888]">동국대 WISE · 컴퓨터공학과</div>
          </div>
          <button className="px-3 py-1.5 bg-[#f5f5f5] rounded-md text-[12px] font-bold">프로필 수정</button>
        </div>

        {/* Simple Menu List */}
        <div className="border-t-[8px] border-[#f9f9f9]">
          <div className="px-[18px] py-4 border-b border-[#f5f5f5] flex justify-between font-medium">
            <span>판매내역</span><span>{">"}</span>
          </div>
          <div className="px-[18px] py-4 border-b border-[#f5f5f5] flex justify-between font-medium">
            <span>구매내역</span><span>{">"}</span>
          </div>
          <div className="px-[18px] py-4 flex justify-between font-medium text-red-500">
            <span>로그아웃</span>
          </div>
        </div>
      </div>
    </div>
  );
}