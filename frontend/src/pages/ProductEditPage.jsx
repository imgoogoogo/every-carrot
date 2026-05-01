import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProductById, updateProduct } from "../api(test)/productService"; 

const CATEGORIES = [
  { id: 1, name: "전자기기" }, { id: 2, name: "도서" }, { id: 3, name: "의류/패션" },
  { id: 4, name: "생활용품" }, { id: 5, name: "기타" },
];

export default function ProductEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getProductById(id);
        setTitle(data.title);
        
        if (data.category && data.category.id) {
          setCategory(String(data.category.id)); 
        }
      
        setPrice(data.price.toLocaleString());
        setDescription(data.description);
        if (data.image_url) setImagePreview(data.image_url);
      } catch (err) {
        alert("정보를 불러오지 못했습니다.");
        navigate(-1);
      }
    };
    fetchDetail();
  }, [id, navigate]);

  const handlePriceInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPrice(raw ? Number(raw).toLocaleString() : "");
  };

  const handleSubmit = async () => {
    if (!title.trim() || !category || !price || !description.trim()) return alert("모든 항목을 입력해주세요.");
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category_id", Number(category));
      formData.append("price", Number(price.replace(/,/g, "")));
      formData.append("description", description);
      if (image) formData.append("image", image);

      await updateProduct(id, formData);
      alert("수정 완료!");
      navigate(`/products/${id}`, { replace: true });
    } catch (err) {
      alert(err.message || "오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full bg-[#FAFAFA] font-app relative flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-[#eee] px-[18px] py-[14px] flex items-center gap-3 flex-none z-[110]">
        <button onClick={() => navigate(-1)} className="p-1 active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
        </button>
        <span className="text-[17px] font-bold text-[#222] flex-1">내 물건 수정하기</span>
        <button onClick={handleSubmit} disabled={submitting} className={`px-[18px] py-2 rounded-[8px] text-sm font-bold text-white transition-all ${submitting ? "bg-[#ccc]" : "bg-brand active:scale-95"}`}>
          {submitting ? "저장 중..." : "수정 완료"}
        </button>
      </div>

      {/* Scroll Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white pb-10">
        <div className="px-[18px] py-5 border-b-[8px] border-[#f5f5f5]">
          <div onClick={() => fileInputRef.current?.click()} className="w-[90px] h-[90px] border-2 border-dashed border-[#ddd] rounded-[12px] flex flex-col items-center justify-center cursor-pointer overflow-hidden relative bg-[#fafafa]">
            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="미리보기" /> : <span className="text-[11px] text-[#bbb]">사진 추가</span>}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files[0];
            if (file) { setImage(file); const reader = new FileReader(); reader.onload = (ev) => setImagePreview(ev.target.result); reader.readAsDataURL(file); }
          }} />
        </div>

        <div className="px-[18px] py-4 border-b border-[#f5f5f5]">
          <input type="text" placeholder="글 제목" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border-none outline-none text-base text-[#222] bg-white" />
        </div>
        <div className="px-[18px] py-4 border-b border-[#f5f5f5]">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border-none outline-none text-base bg-white cursor-pointer">
            <option value="" disabled>카테고리 선택</option>
            {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
        </div>
        <div className="px-[18px] py-4 border-b border-[#f5f5f5] flex items-center gap-2 bg-white">
          <span className="font-semibold text-[#222]">₩</span>
          <input type="text" inputMode="numeric" placeholder="가격 (원)" value={price} onChange={handlePriceInput} className="flex-1 border-none outline-none text-base text-[#222] bg-white" />
        </div>
        <div className="px-[18px] py-4 bg-white">
          <textarea placeholder="물품 설명" value={description} onChange={(e) => setDescription(e.target.value)} rows={10} className="w-full border-none outline-none text-[15px] text-[#222] bg-white resize-none" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-[#eee] px-[18px] py-3 flex items-center flex-none z-[100] shadow-sm">
        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1 text-brand text-[13px] font-semibold active:opacity-50">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><circle cx="12" cy="13" r="3" /></svg>
          {image ? "1" : "0"}/1
        </button>
        <div className="flex-1" />
        <div className="flex items-center gap-[6px] text-[13px] text-[#555] font-medium">가격 제안 받기 <div className="w-[42px] h-6 bg-brand rounded-[12px] relative"><div className="absolute top-[3px] right-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm" /></div></div>
      </div>
    </div>
  );
}