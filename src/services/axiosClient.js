import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const onResponse = (response) => {
  // Nếu request yêu cầu dạng blob, giữ nguyên cấu trúc gốc
  if (response.config.responseType === "blob") {
    return response;
  }

  // Các trường hợp khác trả về dữ liệu gốc
  if (response?.data) {
    return response.data;
  }
  return response;
};

const onResponseError = (error) => {
  if (error.response?.data) {
    return Promise.reject(error.response.data);
  }
  return Promise.reject(error);
};

axiosClient.interceptors.response.use(onResponse, onResponseError);

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;
