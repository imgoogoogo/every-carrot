import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../api(test)/userService"; 

export default function MyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("MY");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState(null);

  const [tempNickname, setTempNickname] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setUser({
          name: data.nickname,
          univ: "동국대 WISE", 
          dept: data.department || "컴퓨터공학과",
          avatar: data.nickname[0]
        });
        setTempNickname(data.nickname);
      } catch (err) {
        console.error("프로필 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleUpdate = async () => {
    if (!tempNickname.trim()) {
      alert("닉네임을 입력해주세요");
      return;
    }

  try {
     const formData = new FormData();
      formData.append("nickname", tempNickname); 
     if (user.dept) formData.append("department", user.dept);

      const updatedData = await updateUserProfile(formData);
    
      setUser({
        ...user,
       name: updatedData.nickname,
        avatar: updatedData.nickname[0]
      });

      alert("프로필이 성공적으로 수정되었습니다");
     setIsEditOpen(false);
    } catch (err) {
      alert("수정 실패: " + (err.message || "서버 오류가 발생했습니다"));
    }
  };

  const handleLogout = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const tabs = [
    { name: "홈", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4", path: "/main" },
    { name: "글쓰기", icon: "M12 4v16m8-8H4", path: "/write" },
    { name: "채팅", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z", path: "/chat" },
    { name: "MY", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", path: "/mypage" },
  ];

  if (isLoading) return <div className="flex items-center justify-center min-h-screen text-gray-400">정보를 불러오는 중...</div>;
  if (!user) return null;

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen font-app flex flex-col pb-[80px] relative">
      
      <div className="w-full px-[18px] py-[16px] font-bold text-[17px] text-[#9b9b9b] border-b border-[#eee] sticky top-0 bg-white z-[100] text-center">
        마이페이지
      </div>
      
      <div className="flex-1 overflow-y-auto no-scrollbar w-full text-left">
        <div className="px-[18px] py-8 flex items-center gap-4">
          <div className="w-16 h-16 shrink-0 rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center text-white text-2xl font-bold shadow-sm">
            {user.avatar}
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-start">
            <div className="text-[19px] font-bold text-[#222]">{user.name}</div>
            <div className="text-[13px] text-[#888] mt-0.5">{user.univ} · {user.dept}</div>
          </div>
          
          <button 
            onClick={() => setIsEditOpen(true)} 
            className="px-3 py-1.5 bg-[#f5f5f5] rounded-md text-[12px] font-bold text-[#555] active:bg-gray-200 shrink-0"
          >
            프로필 수정
          </button>
        </div>

        <div className="border-t-[8px] border-[#f9f9f9]">
          <div 
            onClick={() => navigate("/mypage/products")} 
            className="px-[18px] py-4 border-b border-[#f5f5f5] flex justify-between items-center cursor-pointer active:bg-gray-50"
          >
            <span className="font-medium text-[#333]">내 물품 목록</span>
            <span className="text-[#ccc] text-[18px]">{"〉"}</span>
          </div>
          
          <div 
            onClick={handleLogout}
            className="px-[18px] py-4 flex justify-between items-center cursor-pointer active:bg-gray-50 text-[#FF4D4F]"
          >
            <span className="font-medium">로그아웃</span>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-6">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          <div className="bg-white w-full max-w-[380px] rounded-[28px] shadow-2xl relative z-[210] p-6 flex flex-col">
            
            <div className="relative w-full flex items-center justify-center mb-8 text-[#222]">
              <button onClick={() => setIsEditOpen(false)} className="absolute left-0 p-1">
                <svg width="24" height="24" fill="none" stroke="#333" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span className="font-black text-[18px]">프로필 수정</span>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2 items-start text-left">
                <label className="text-[13px] font-bold text-brand ml-1">닉네임</label>
                <input 
                  type="text" 
                  value={tempNickname}
                  onChange={(e) => setTempNickname(e.target.value)} 
                  className="w-full bg-[#f6f6f6] border border-transparent focus:border-brand/30 focus:bg-white rounded-[15px] px-4 py-4 outline-none text-[15px] transition-all" 
                />
              </div>
            </div>

            <button 
              onClick={handleUpdate} 
              className="w-full bg-brand text-white py-4 rounded-[15px] font-bold text-[16px] mt-10 active:scale-[0.97] transition-all shadow-lg shadow-brand/20"
            >
              수정 완료
            </button>
          </div>
        </div>
      )}

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] flex justify-around pt-2.5 pb-6 z-[110] shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
        {tabs.map((tab) => (
          <button key={tab.name} onClick={() => { setActiveTab(tab.name); navigate(tab.path); }} className="flex flex-col items-center gap-1.5 px-4 relative flex-1 active:scale-95 transition-transform">
            <svg width="24" height="24" fill="none" stroke={activeTab === tab.name ? "#555" : "#ccc"} strokeWidth="2.2" viewBox="0 0 24 24">
              <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={`text-[13px] ${activeTab === tab.name ? "font-bold text-brand-red" : "font-medium text-[#bbb]"}`}>{tab.name}</span>
            {tab.name === "채팅" && <span className="absolute top-[-2px] right-[28%] w-[15px] h-[15px] bg-[#FF4D4F] rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-white">1</span>}
          </button>
        ))}
      </div>
    </div>
  );
}