import axios from "./axios";

export const sendVerification = async (email) => {
  try {
    const response = await axios.post("/auth/send-verification", { email });
    return response.data; // { success, message } [cite: 126]
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
      localStorage.setItem("token", access_token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


/** 테스트용 코드(테스트완)
 export const sendVerification = async (email) => {
  console.log("테스트 - 인증번호 발송 시뮬레이션:", email);
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));
};

export const verifyEmail = async (email, code) => {
  console.log("테스트 - 인증번호 확인 시뮬레이션:", { email, code });
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));
};

export const register = async (userData) => {
  console.log("테스트 - 회원가입 완료 시뮬레이션:", userData);
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 800));
};

export const login = async (email, password) => {
  console.log("테스트 - 로그인 시도 시뮬레이션:", { email, password });
  return new Promise((resolve) => {
    setTimeout(() => {
      const fakeToken = "this_is_a_mock_jwt_token_for_seungbin";
      localStorage.setItem("token", fakeToken);
      resolve({
        success: true,
        data: { access_token: fakeToken, user: { nickname: "승빈", email } }
      });
    }, 800);
  });
}; */