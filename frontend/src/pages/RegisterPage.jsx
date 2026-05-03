import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendVerification, verifyEmail, register } from "../api(test)/authService";

const DEPARTMENTS = [
  '불교학전공', '불교문화콘텐츠전공', '명상심리상담학과',
  '웹문예학과', '국사학과', '고고미술사학과',
  '영어영문학과', '일어일문학과', '중어중문학과', '디자인미술학과',
  '스포츠과학전공', '스포츠의학전공', '엘리트스포츠전공',
  '조경·정원디자인학과',
  '공공행정학전공', '경찰행정학전공', '사회복지학과', '아동청소년교육학과', '항공서비스무역학과',
  '경영학과', '회계세무학과', '정보경영학과',
  '호텔관광경영학전공', '조리외식경영학전공',
  '유아교육과', '가정교육과', '수학교육과',
  '보건의료정보학과', '뷰티아트산업학과',
  '바이오·화학융합학부',
  '전자정보통신공학과', '원자력·에너지·전기공학과',
  '안전보건전공', '소방방재전공', '자동차소재부품공학전공', '컴퓨터공학과',
  '한의예과·한의학과', '의예과·의학과', '간호학과',
  '글로컬인재학부',
];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [department, setDepartment] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleSendCode = async () => {
    try {
      await sendVerification(email); 
      setIsCodeSent(true);
      alert("인증번호가 발송되었습니다!"); 
    } catch (err) {
      alert(err.message || "발송 실패");
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyEmail(email, verificationCode);
      setIsVerified(true);
      alert("이메일 인증이 완료되었습니다!"); 
    } catch (err) {
      alert("인증번호가 올바르지 않습니다."); 
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isVerified) return alert("이메일 인증을 먼저 해주세요.");

    try {
      const userData = { email, password, nickname, department };
      await register(userData);
      alert("회원가입이 완료되었습니다! 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      alert(err.message || "가입 실패");
    }
  };

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col px-[25px]">
      <div className="py-[14px] flex items-center justify-start border-b border-[#eee] -mx-[25px] px-[25px] sticky top-0 bg-white z-[100]">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="mr-3 active:opacity-50"
        >
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[17px] font-bold text-[#222]">회원가입</span>
      </div>
      <div className="flex-1 flex flex-col pt-8 pb-10">
        <form className="flex flex-col gap-3 w-full" onSubmit={handleRegister}>
          <div className="w-full bg-[#f6f6f6] rounded-[12px] flex items-center px-4 py-[14px]">
            <input
              type="email"
              placeholder="학교 이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isVerified} 
              className="flex-1 bg-transparent outline-none text-[15px]"
            />
            <button type="button" onClick={handleSendCode} className="text-brand font-bold text-[14px] ml-2">
              {isCodeSent ? "재요청" : "인증요청"}
            </button>
          </div>

          {isCodeSent && !isVerified && (
            <div className="w-full bg-[#f6f6f6] rounded-[12px] flex items-center px-4 py-[14px] mt-2 border border-brand">
              <input
                type="text"
                placeholder="인증번호 6자리"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[15px]"
              />
              <button type="button" onClick={handleVerifyCode} className="bg-brand text-white px-3 py-1 rounded-[8px] text-[13px]">
                확인
              </button>
            </div>
          )}

          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[14px]">
            <input
              type="password"
              placeholder="비밀번호 (8자 이상)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] text-[#222]"
            />
          </div>

          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[14px]">
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] text-[#222]"
            />
          </div>

          <div className="w-full bg-[#f6f6f6] rounded-[12px] border border-transparent focus-within:border-brand focus-within:bg-white transition-all px-4 py-[14px]">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] text-[#222] appearance-none cursor-pointer"
            >
              <option value="">학과를 선택하세요</option>
              {DEPARTMENTS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit" 
            className="w-full bg-brand text-white font-bold text-[16px] py-[16px] rounded-[12px] mt-10 active:scale-[0.98] transition-transform"
          >
            가입 완료
          </button>
        </form>
      </div>
    </div>
  );
}