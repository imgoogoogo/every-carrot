import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col px-[18px]">
      <div className="py-[14px] flex items-center justify-start border-b border-[#eee] -mx-[18px] px-[18px]">
        <span className="text-[17px] font-bold text-[#222]">로그인</span>
      </div>

      <div className="flex-1 flex flex-col items-start">
        <h1 className="text-[32px] font-bold text-left mt-[60px] mb-[40px] text-brand w-full">
          Every Carrot
        </h1>

        <form className="flex flex-col gap-2 w-full">
          <div className="py-4 border-b border-[#f5f5f5] w-full text-left">
            <input 
              type="email" 
              placeholder="학교 이메일" 
              className="w-full bg-transparent border-none outline-none text-[15px] text-[#222] placeholder-[#bbb]" 
            />
          </div>
          <div className="py-4 border-b border-[#f5f5f5] w-full text-left">
            <input 
              type="password" 
              placeholder="비밀번호" 
              className="w-full bg-transparent border-none outline-none text-[15px] text-[#222] placeholder-[#bbb]" 
            />
          </div>

          <button
            type="button"
            onClick={() => navigate("/main")}
            className="w-full bg-brand text-white font-bold text-[16px] py-[14px] rounded-[8px] mt-10 active:opacity-90"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 w-full text-left text-[13px] text-[#888]">
          에브리캐롯이 처음이신가요?
          <button onClick={() => navigate("/register")} className="font-bold ml-2 text-brand">회원가입</button>
        </div>
      </div>
    </div>
  );
}