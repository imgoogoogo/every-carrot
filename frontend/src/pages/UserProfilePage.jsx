import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserProfileById } from "../api(test)/userService";
import api from "../utils/api";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [userRes, productsRes] = await Promise.all([
          getUserProfileById(id),
          api.get(`/api/products?seller_id=${id}&status=판매중`),
        ]);
        setUser(userRes);
        if (productsRes.data?.success) {
          setProducts(productsRes.data.data.products);
        }
      } catch {
        alert("사용자를 찾을 수 없습니다.");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  if (isLoading) return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex items-center justify-center">
      <div className="text-gray-400">불러오는 중...</div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen flex flex-col font-app">

      {/* Header */}
      <div className="bg-white border-b border-[#eee] px-4 py-3 flex items-center gap-3 sticky top-0 z-[100]">
        <button onClick={() => navigate(-1)} className="p-1 active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[17px] font-bold text-[#222]">프로필</span>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col items-center px-[18px] pt-8 pb-6 border-b border-[#f5f5f5]">
        <div className="w-[80px] h-[80px] rounded-full bg-gradient-to-br from-brand to-brand-soft flex items-center justify-center text-white font-bold text-2xl mb-3 overflow-hidden">
          {user.profile_image ? (
            <img src={user.profile_image} alt="프로필" className="w-full h-full object-cover" />
          ) : (
            user.nickname[0]
          )}
        </div>
        <div className="text-[18px] font-bold text-[#222]">{user.nickname}</div>
        {user.department && (
          <div className="text-[13px] text-[#888] mt-1">{user.department}</div>
        )}
      </div>

      {/* Products */}
      <div className="flex-1 px-[18px] py-4">
        <div className="text-[15px] font-bold text-[#222] mb-3">
          판매 중인 물품 <span className="text-brand">{products.length}</span>
        </div>
        {products.length === 0 ? (
          <div className="text-center py-12 text-[#bbb] text-sm">판매 중인 물품이 없습니다</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/products/${p.id}`)}
                className="bg-white rounded-[12px] border border-[#f0f0f0] overflow-hidden cursor-pointer active:scale-[0.98] transition-transform shadow-sm"
              >
                <div className="w-full aspect-square bg-[#f5f5f5]">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#ccc] text-xs">이미지 없음</div>
                  )}
                </div>
                <div className="p-2">
                  <div className="text-[13px] text-[#222] font-medium overflow-hidden text-ellipsis whitespace-nowrap">{p.title}</div>
                  <div className="text-[13px] font-bold text-brand mt-0.5">{Number(p.price).toLocaleString()}원</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
