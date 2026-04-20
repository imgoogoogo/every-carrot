import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-[430px] mx-auto bg-white min-h-screen font-app flex flex-col">
      <div className="bg-white px-[18px] py-[14px] flex items-center justify-center border-b border-[#eee]">
        <span className="text-[17px] font-bold text-[#222]">로그인</span>
      </div>

      <div className="flex-1 px-[18px] pb-10">
        <h1 className="text-[32px] font-bold text-center text-brand mt-[50px] mb-[40px]">
          Every Carrot
        </h1>

        <form className="flex flex-col gap-2">
          <div className="py-4 border-b border-[#f5f5f5]">
            <input
              type="email"
              placeholder="학교 이메일"
              className="w-full border-none outline-none text-[15px] text-[#222] bg-transparent placeholder-[#bbb]"
            />
          </div>
          <div className="py-4 border-b border-[#f5f5f5]">
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full border-none outline-none text-[15px] text-[#222] bg-transparent placeholder-[#bbb]"
            />
          </div>

          <button
            type="button"
            className="w-full bg-brand text-white font-bold text-[16px] py-[14px] rounded-[8px] mt-8 active:opacity-80"
          >
            로그인
          </button>
        </form>

        <div className="mt-6 text-center text-[13px] text-[#888]">
          에브리캐롯이 처음이신가요?
          <button onClick={() => navigate("/register")} className="font-bold text-brand ml-2">회원가입</button>
        </div>
      </div>
    </div>
  );
}