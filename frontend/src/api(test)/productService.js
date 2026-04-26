import axios from "./axios";

export const getProducts = async (params = {}) => {
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

export const getMyProducts = async () => {
  try {
    const response = await axios.get("/products/me");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axios.post("/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProduct = async (id, formData) => {
  try {
    const response = await axios.put(`/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.data;
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

export const updateProductStatus = async (id, status) => {
  try {
    const response = await axios.patch(`/products/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
