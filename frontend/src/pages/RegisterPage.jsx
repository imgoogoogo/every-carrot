import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col">
      <div className="bg-white px-[18px] py-[14px] flex items-center border-b border-[#eee] sticky top-0 z-[100]">
        <button onClick={() => navigate(-1)} className="mr-2">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[17px] font-bold text-[#222]">회원가입</span>
      </div>

      <div className="flex-1 px-[18px] pb-10">
        <form className="flex flex-col mt-4 items-start">
          <div className="w-full py-4 border-b border-[#f5f5f5] flex items-center gap-2">
            <input type="email" placeholder="학교 이메일" className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#222] placeholder-[#bbb]" />
            <button type="button" className="bg-[#f0f0f0] text-[#555] px-3 py-1.5 rounded-md text-xs font-bold shrink-0">인증요청</button>
          </div>
          <div className="w-full py-4 border-b border-[#f5f5f5] text-left">
            <input type="password" placeholder="비밀번호 (8자 이상)" className="w-full bg-transparent border-none outline-none text-[15px] text-[#222] placeholder-[#bbb]" />
          </div>
          <div className="w-full py-4 border-b border-[#f5f5f5] text-left">
            <input type="text" placeholder="닉네임" className="w-full bg-transparent border-none outline-none text-[15px] text-[#222] placeholder-[#bbb]" />
          </div>
          <div className="w-full py-4 border-b border-[#f5f5f5] text-left">
            <input type="text" placeholder="학과 (예: 컴퓨터공학과)" className="w-full bg-transparent border-none outline-none text-[15px] text-[#222] placeholder-[#bbb]" />
          </div>

          <button type="button" className="w-full bg-brand text-white font-bold text-[16px] py-[14px] rounded-[8px] mt-10 active:opacity-90">
            가입 완료
          </button>
        </form>
      </div>
    </div>
  );
}