import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";

const CATEGORIES = [
  { id: 1, name: "전자기기" },
  { id: 2, name: "의류/잡화" },
  { id: 3, name: "도서/교재" },
  { id: 4, name: "스포츠/레저" },
  { id: 5, name: "가구/인테리어" },
  { id: 6, name: "식품/음료" },
  { id: 7, name: "뷰티/미용" },
  { id: 8, name: "기타" },
];

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/api/products/${id}`).then((res) => {
      const p = res.data.data;
      setTitle(p.title);
      setCategory(String(p.category.id));
      setPrice(Number(p.price).toLocaleString());
      setDescription(p.description);
      if (p.image_url) setImagePreview(p.image_url);
    }).catch(() => {
      alert("상품 정보를 불러올 수 없습니다.");
      navigate(-1);
    });
  }, [id, isEdit, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handlePriceInput = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setPrice(raw ? Number(raw).toLocaleString() : "");
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    if (!category) return alert("카테고리를 선택해주세요.");
    if (!price) return alert("가격을 입력해주세요.");
    if (!description.trim()) return alert("설명을 입력해주세요.");

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", price.replace(/,/g, ""));
      formData.append("category_id", category);
      if (image) formData.append("image", image);

      if (isEdit) {
        await api.put(`/api/products/${id}`, formData);
      } else {
        await api.post("/api/products", formData);
      }

      navigate("/main");
    } catch (err) {
      alert(err.response?.data?.message || "저장에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#FAFAFA] min-h-full font-app flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-[#eee] px-[18px] py-[14px] flex items-center gap-3 sticky top-0 z-[100]">
        <button onClick={() => navigate(-1)} className="bg-transparent border-none cursor-pointer p-1 flex active:opacity-50">
          <svg width="22" height="22" fill="none" stroke="#333" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[17px] font-bold text-[#222] flex-1">
          {isEdit ? "내 물건 수정하기" : "동국대 WISE에 올리기"}
        </span>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className={`px-[18px] py-2 rounded-[8px] text-sm font-bold text-white transition-all ${
            submitting ? "bg-[#ccc] cursor-not-allowed" : "bg-brand cursor-pointer active:scale-[0.98]"
          }`}
        >
          {submitting ? "저장 중..." : isEdit ? "수정 완료" : "등록하기"}
        </button>
      </div>

      {/* Scroll Area */}
      <div className="flex-1 pb-10">

        {/* Image Upload */}
        <div className="bg-white px-[18px] py-5 border-b-[8px] border-[#f5f5f5]">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-[90px] h-[90px] border-2 border-dashed border-[#ddd] rounded-[12px] flex flex-col items-center justify-center cursor-pointer overflow-hidden bg-[#fafafa] relative active:opacity-70"
          >
            {imagePreview ? (
              <>
                <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setImage(null);
                    setImagePreview(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center cursor-pointer"
                >
                  <svg width="10" height="10" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                  </svg>
                </div>
              </>
            ) : (
              <>
                <svg width="26" height="26" fill="none" stroke="#bbb" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-[11px] text-[#bbb] mt-1 font-medium">사진 추가</span>
                <span className="text-[10px] text-[#ccc]">0/1</span>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </div>

        {/* Title */}
        <div className="bg-white px-[18px] py-4 border-b border-[#f5f5f5]">
          <input
            type="text"
            placeholder="글 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={50}
            className="w-full border-none outline-none text-base text-[#222] bg-transparent placeholder:text-[#bbb]"
          />
        </div>

        {/* Category */}
        <div className="bg-white px-[18px] py-4 border-b border-[#f5f5f5]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full border-none outline-none text-base bg-transparent cursor-pointer appearance-none ${
              category ? "text-[#222]" : "text-[#bbb]"
            }`}
          >
            <option value="" disabled>카테고리 선택</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="bg-white px-[18px] py-4 border-b border-[#f5f5f5] flex items-center gap-2">
          <span className="text-base font-semibold text-[#222] shrink-0">₩</span>
          <input
            type="text"
            inputMode="numeric"
            placeholder="가격 (원)"
            value={price}
            onChange={handlePriceInput}
            className="flex-1 border-none outline-none text-base text-[#222] bg-transparent placeholder:text-[#bbb]"
          />
          {price && (
            <button onClick={() => setPrice("")} className="bg-transparent border-none cursor-pointer p-[2px] active:opacity-50">
              <svg width="16" height="16" fill="none" stroke="#bbb" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" />
                <path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>

        {/* Description */}
        <div className="bg-white px-[18px] py-4">
          <textarea
            placeholder={`동국대 WISE 학우에게 물품을 설명해주세요.\n(브랜드, 상태, 구매 시기 등)`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={1000}
            rows={10}
            className="w-full border-none outline-none text-[15px] text-[#222] bg-transparent resize-none leading-relaxed placeholder:text-[#bbb]"
          />
          <div className="text-right text-xs text-[#ccc] mt-1">{description.length}/1000</div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-white border-t border-[#eee] px-[18px] py-3 flex items-center gap-4">
        <button onClick={() => fileInputRef.current?.click()} className="bg-transparent border-none cursor-pointer p-[6px] flex items-center gap-1 text-brand active:opacity-70">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="13" r="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[13px] font-semibold">{image ? "1" : "0"}/1</span>
        </button>
        <div className="flex-1" />
        <label className="flex items-center gap-[6px] cursor-pointer">
          <span className="text-[13px] text-[#555] font-medium">가격 제안 받기</span>
          <div className="w-[42px] h-6 bg-brand rounded-[12px] relative">
            <div className="absolute top-[3px] right-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm" />
          </div>
        </label>
      </div>
    </div>
  );
}
