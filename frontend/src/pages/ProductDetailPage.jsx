import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById } from "../api(test)/productService";
import api from "../utils/api";

const StatusBadge = ({ status }) => {
  const bgColors = {
    판매중: "bg-brand",
    예약중: "bg-brand-red",
    판매완료: "bg-[#ccc]",
  };
  return (
    <span className={`${bgColors[status]} text-white text-[13px] font-bold px-3 py-[3px] rounded-[6px] tracking-wide shadow-sm`}>
      {status}
    </span>
  );
};

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams(); 
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const myUserId = (() => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return null;
      return JSON.parse(atob(token.split(".")[1])).id ?? null;
    } catch { return null; }
  })();
  const isMine = product && myUserId === product.seller.id;

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        console.error("상세 정보 로드 실패:", err);
        alert("존재하지 않는 물품이거나 삭제된 물품입니다.");
        navigate("/main");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      alert("삭제되었습니다.");
      navigate("/main");
    } catch (err) {
      alert(err.response?.data?.message || "삭제에 실패했습니다.");
    }
  };

  const handleStartChat = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return navigate("/login");

    setChatLoading(true);
    try {
      const res = await api.post("/api/chats", {
        product_id: product.id,
        seller_id: product.seller.id,
      });
      navigate(`/chat/${res.data.data.id}`);
    } catch (err) {
      const code = err.response?.data?.error?.code;
      if (code === "CANNOT_CHAT_WITH_YOURSELF") {
        alert("본인 상품에는 채팅을 시작할 수 없습니다.");
      } else {
        alert(err.response?.data?.message || "채팅방 생성에 실패했습니다.");
      }
    } finally {
      setChatLoading(false);
    }
  };

  if (isLoading) return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex items-center justify-center">
      <div className="text-gray-400">물품 정보를 불러오는 중...</div>
    </div>
  );

  if (!product) return null;

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col relative font-app pb-[80px]">
      
      <div className="bg-white px-4 py-3 flex items-center justify-between sticky top-0 z-[100] border-b border-[#eee] w-full">
        <button onClick={() => navigate(-1)} className="p-1 active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {isMine && (
          <div className="relative">
            <button onClick={() => setMenuOpen((v) => !v)} className="p-1 active:opacity-50">
              <svg width="24" height="24" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 5v.01M12 12v.01M12 19v.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-[110]" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 bg-white rounded-[12px] shadow-lg border border-[#eee] z-[120] overflow-hidden w-[120px]">
                  <button
                    onClick={() => { setMenuOpen(false); navigate(`/write/${id}`); }}
                    className="w-full px-4 py-3 text-left text-[14px] text-[#222] hover:bg-[#f9f9f9] active:bg-[#f5f5f5]"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => { setMenuOpen(false); handleDelete(); }}
                    className="w-full px-4 py-3 text-left text-[14px] text-red-500 hover:bg-[#f9f9f9] active:bg-[#f5f5f5]"
                  >
                    삭제하기
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar w-full">
        <div className="w-full aspect-[4/3] bg-gray-100 relative">
          <img src={product.image_url} className="w-full h-full object-cover" alt="상품 이미지" />
          <div className="absolute top-4 left-4">
            <StatusBadge status={product.status} />
          </div>
        </div>

        <div className="w-full px-[18px] pt-3 pb-0 flex items-center gap-3 cursor-pointer active:opacity-70" onClick={() => navigate(`/users/${product.seller.id}`)}>
          <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center text-white font-bold text-lg">
            {product.seller.profile_image ? (
              <img src={product.seller.profile_image} className="w-full h-full rounded-full object-cover" alt="프로필" />
            ) : (
              product.seller.nickname[0]
            )}
          </div>
          <div className="flex-1 flex flex-col items-start text-left">
            <div className="text-[15px] font-bold text-[#222]">{product.seller.nickname}</div>
            <div className="text-[12px] text-[#888]">{product.seller.department}</div>
          </div>
        </div>

        <div className="w-full px-[18px] pt-0 pb-8 text-left flex flex-col items-start">
          <div className="w-full h-[1px] bg-[#f5f5f5] my-4"></div> 
  
          <h1 className="text-[22px] font-bold text-[#222] mb-1 mt-0 leading-tight">
            {product.title}
          </h1>

          <div className="text-[12px] text-[#aaa] mb-2">
            {product.category?.name || "기타"} · {new Date(product.created_at).toLocaleDateString()}
          </div>

          <div className="text-[22px] font-black text-brand tracking-tight mb-5">
            {product.price.toLocaleString()}원
          </div>

          <p className="text-[15px] text-[#333] leading-relaxed whitespace-pre-wrap w-full text-left">
            {product.description}
          </p>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-[#eee] px-[18px] py-3 flex items-center gap-4 z-[110] shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
        <button 
          onClick={() => setIsLiked(!isLiked)}
          className="pr-4 border-r border-[#eee] active:scale-90 transition-transform"
        >
          <svg width="26" height="26" fill={isLiked ? "#E94E1B" : "none"} stroke={isLiked ? "#E94E1B" : "#aaa"} strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          onClick={handleStartChat}
          disabled={chatLoading}
          className={`flex-1 py-4 rounded-[12px] font-bold text-[16px] transition-transform shadow-md text-white ${
            chatLoading ? "bg-[#ccc] cursor-not-allowed" : "bg-brand-red active:scale-[0.98] cursor-pointer"
          }`}
        >
          {chatLoading ? "연결 중..." : "채팅하기"}
        </button>
      </div>
    </div>
  );
}