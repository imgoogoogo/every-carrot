import axios from "./axios";

export const sendVerification = async (email) => {
  try {
    const response = await axios.post("/auth/send-verification", { email });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const verifyEmail = async (email, code) => {
  try {
    const response = await axios.post("/auth/verify-email", { email, code });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const register = async (userData) => {
  try {
    const response = await axios.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post("/auth/login", { email, password });
    const { access_token } = response.data.data;
    if (access_token) {
      localStorage.setItem("accessToken", access_token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
