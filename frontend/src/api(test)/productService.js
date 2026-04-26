import axios from "./axios";

/** export const getProducts = async (params = {}) => {
  try {
    const response = await axios.get("/products", { params });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/products/${id}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; */

// 테스트용 코드(테스트완)
const mockProducts = [
  { 
    id: 1, 
    title: "맥북 에어 M2 2022 스그", 
    price: 850000, 
    status: "판매중", 
    category: { name: "전자기기" },
    description: "상태 아주 깨끗합니다. 캠퍼스 내 직거래 선호해요.",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    seller: { nickname: "컴공과_승빈", department: "컴퓨터공학과" },
    created_at: "2026-04-26T12:00:00Z"
  },
  { 
    id: 2, 
    title: "아이패드 10세대 + 애플펜슬", 
    price: 380000, 
    status: "판매중", 
    category: { name: "전자기기" },
    description: "필기용으로만 썼어요. 종이질감 필름 붙어있습니다.",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    seller: { nickname: "디자인_열정", department: "디자인학과" },
    created_at: "2026-04-26T10:30:00Z"
  },
  { 
    id: 3, 
    title: "자취 미니 전기밥솥 3인용", 
    price: 25000, 
    status: "예약중", 
    category: { name: "생활용품" },
    description: "졸업해서 내놓습니다. 작동 잘 돼요!",
    image_url: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800",
    seller: { nickname: "경영_알뜰이", department: "경영학과" },
    created_at: "2026-04-26T09:00:00Z"
  }
];

export const getProducts = async (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ products: mockProducts });
    }, 400); 
  });
};

export const getProductById = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === parseInt(id));
      resolve(foundProduct || mockProducts[0]); 
    }, 400);
  });
};