import axios from "./axios";

export const getUserProfile = async () => {
  try {
    const response = await axios.get("/users/me");
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getUserProfileById = async (userId) => {
  try {
    const response = await axios.get(`/users/${userId}`);
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await axios.put("/users/me", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }); 
    return response.data.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};


/* 테스트용 코드(테스트완)
 export const getUserProfile = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nickname: "이승빈",
        department: "컴퓨터공학과",
      });
    }, 500);
  });
};

export const updateUserProfile = async (updateData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        nickname: updateData.nickname,
      });
    }, 500);
  });
}; */
