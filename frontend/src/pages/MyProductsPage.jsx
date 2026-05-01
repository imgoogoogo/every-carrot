import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProducts } from "../api(test)/productService"; 

const StatusBadge = ({ status }) => {
  const bgColors = { 판매중: "bg-brand", 예약중: "bg-brand-red", 판매완료: "bg-[#ccc]" };
  return <span className={`${bgColors[status]} text-white text-[11px] font-bold px-2 py-[2px] rounded-[4px] shadow-sm`}>{status}</span>;
};

export default function MyProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchMyProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getMyProducts(); 
      
      setProducts(response.products || []); 
    } catch (err) {
      console.error("내 물품 로드 실패:", err);
      setProducts([]); 
    } finally {
      setIsLoading(false);
    }
  };
  fetchMyProducts();
}, []);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-gray-400">목록 불러오는 중...</div>;

  return (
    <div className="w-full max-w-[430px] mx-auto bg-white min-h-screen font-app flex flex-col pb-10">
      
      <div className="w-full px-[18px] py-[16px] font-bold text-[17px] text-[#9b9b9b] border-b border-[#eee] sticky top-0 bg-white z-[100] text-center relative">
        <button onClick={() => navigate(-1)} className="absolute left-[18px] top-1/2 -translate-y-1/2 p-1">
          <svg width="22" height="22" fill="none" stroke="#9b9b9b" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        내 물품 목록
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {products.length > 0 ? (
          products.map((product) => (
            <div 
              key={product.id} 
              onClick={() => navigate(`/products/${product.id}`)} 
              className="flex gap-4 px-[18px] py-[18px] border-b border-[#f5f5f5] active:bg-gray-50 cursor-pointer"
            >
              <div className="relative shrink-0">
                <img src={product.image_url} className="w-[115px] h-[115px] rounded-[12px] object-cover bg-[#f9f9f9]" alt="" />
                <div className="absolute top-[2px] left-[7px]"><StatusBadge status={product.status} /></div>
              </div>

              <div className="flex flex-1 flex-col justify-start items-start text-left py-0.5">
                <div className="text-[16px] font-bold text-[#222] truncate w-full mb-1">{product.title}</div>
                <div className="text-[12.5px] text-[#999] mb-1.5">{product.created_at?.split('T')[0]}</div>
                <div className="text-[18px] font-black text-brand tracking-tight">{product.price.toLocaleString()}원</div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-gray-400 text-sm">등록된 물품이 없습니다.</div>
        )}
      </div>
    </div>
  );
}