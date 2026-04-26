import { useState } from "react"; 
import { useNavigate } from "react-router-dom";
import { login } from "../api(test)/authService";

export default function LoginPage() {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    if (e) e.preventDefault(); 
    
    try {
      console.log("로그인 시도 중...", { email, password });
      
      await login(email, password);
      
      navigate("/main"); 
    } catch (err) {
      alert("로그인 실패!");
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col px-[25px]">
      <div className="py-[14px] flex items-center justify-start border-b border-[#eee] -mx-[25px] px-[25px]">
        <span className="text-[17px] font-bold text-[#222]">로그인</span>
      </div>

      <div className="flex-1 flex flex-col items-start pt-[60px]">
        <h1 className="text-[36px] font-black text-left mb-[48px] text-brand tracking-tighter">
          Every Carrot
        </h1>

        <form className="flex flex-col gap-3 w-full" onSubmit={handleLogin}>
          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[14px]">
            <input
              type="email"
              placeholder="학교 이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] text-[#222] placeholder:text-[#bbb]"
            />
          </div>

          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[14px]">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] text-[#222] placeholder:text-[#bbb]"
            />
          </div>

          <button
            type="submit" 
            className="w-full bg-brand text-white font-bold text-[16px] py-[16px] rounded-[12px] mt-8 active:scale-[0.98] transition-transform"
          >
            로그인
          </button>
        </form>

        <div className="mt-8 w-full text-center text-[14px] text-[#888]">
          에브리캐롯이 처음이신가요?
          <button
            onClick={() => navigate("/register")}
            className="font-bold ml-2 text-brand"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
