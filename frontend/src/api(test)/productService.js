import axios from "./axios";

export const getProducts = async (params = {}) => {
  try {
    const response = await axios.get("/products", { params });
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMyProducts = async () => {
  try {
    const response = await axios.get("/products/me");
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`/products/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data || response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
}; 


/* let mockProducts = [
  { 
    id: 1, 
    title: "맥북 에어 M2 2022 스그", 
    price: 850000, 
    status: "판매중", 
    category: { id: 1, name: "전자기기" }, // 첫 번째는 잘 되어 있음
    description: "상태 아주 깨끗합니다. 캠퍼스 내 직거래 선호해요.",
    image_url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800",
    seller: { id:1, nickname: "이승빈", department: "컴퓨터공학과" },
    created_at: "2026-04-26T12:00:00Z"
  },
  { 
    id: 2, 
    title: "아이패드 10세대 + 애플펜슬", 
    price: 380000, 
    status: "판매중", 
    category: { id: 1, name: "전자기기" }, 
    description: "필기용으로만 썼어요. 종이질감 필름 붙어있습니다.",
    image_url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800",
    seller: { id:2, nickname: "디자인_열정", department: "디자인학과" },
    created_at: "2026-04-26T10:30:00Z"
  }
];


export const getProducts = async (params = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ products: mockProducts }), 400); 
  });
};

export const getMyProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const MY_ID = 1; 

      const myFilteredProducts = mockProducts.filter(
        (product) => product.seller.id === MY_ID
      );

      resolve({ products: myFilteredProducts });
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

export const deleteProduct = async (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockProducts = mockProducts.filter(p => p.id !== parseInt(id));
      console.log(`Product ${id} 삭제 완료. 남은 물품:`, mockProducts);
      resolve({ success: true });
    }, 400);
  });
}; 

export const updateProduct = async (id, formData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockProducts.findIndex((p) => p.id === parseInt(id));

      if (index !== -1) {
        const categoryId = parseInt(formData.get("category_id"));
        const categoryMap = {
          1: "전자기기",
          2: "도서",
          3: "의류/패션",
          4: "생활용품",
          5: "기타",
        };

        mockProducts[index] = {
          ...mockProducts[index], 
          title: formData.get("title"),
          price: Number(formData.get("price")),
          description: formData.get("description"),
          category: {
            id: categoryId,
            name: categoryMap[categoryId] || "기타",
          },
          image_url: formData.get("image") 
            ? URL.createObjectURL(formData.get("image")) 
            : mockProducts[index].image_url,
        };

        console.log(`[Mock API] 물품 ${id} 실제 배열 데이터 수정 완료:`, mockProducts[index]);
      }

      resolve({ success: true });
    }, 400);
  });
}; */