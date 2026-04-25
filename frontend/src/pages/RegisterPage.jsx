import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col px-[25px]">
      <div className="py-[14px] flex items-center justify-start border-b border-[#eee] -mx-[25px] px-[25px] sticky top-0 bg-white z-[100]">
        <button onClick={() => navigate(-1)} className="mr-3 active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[17px] font-bold text-[#222]">회원가입</span>
      </div>

      <div className="flex-1 flex flex-col pt-8 pb-10">
        <form className="flex flex-col gap-3 w-full">
          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[10px] flex items-center gap-2">
            <input
              type="email"
              placeholder="학교 이메일"
              className="flex-1 bg-transparent outline-none text-[15px] text-[#222] placeholder:text-[#bbb]"
            />
            <button
              type="button"
              className="bg-[#eee] text-[#666] px-3 py-2 rounded-[8px] text-[12px] font-bold shrink-0 active:bg-gray-200"
            >
              인증요청
            </button>
          </div>

          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[14px]">
            <input
              type="password"
              placeholder="비밀번호 (8자 이상)"
              className="w-full bg-transparent outline-none text-[15px] text-[#222] placeholder:text-[#bbb]"
            />
          </div>

          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[14px]">
            <input
              type="text"
              placeholder="닉네임"
              className="w-full bg-transparent outline-none text-[15px] text-[#222] placeholder:text-[#bbb]"
            />
          </div>

          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[14px]">
            <input
              type="text"
              placeholder="학과 (예: 컴퓨터공학과)"
              className="w-full bg-transparent outline-none text-[15px] text-[#222] placeholder:text-[#bbb]"
            />
          </div>

          <button
            type="button"
            className="w-full bg-brand text-white font-bold text-[16px] py-[16px] rounded-[12px] mt-10 active:scale-[0.98] transition-transform"
          >
            가입 완료
          </button>
        </form>
      </div>
    </div>
  );
}