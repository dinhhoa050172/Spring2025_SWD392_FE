import axiosClient from "./axiosClient.js";

export const userService = {
  getUser: async () => {
    const response = await axiosClient.get("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    localStorage.setItem("userDataNhanAi", JSON.stringify(response.data));
    return response.data;
  },

  editProfile: async (data) => {
    const response = await axiosClient.patch("/api/user/profile", data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data;
  },

  changePassword: async (userId, oldPasword, newPassword) => {
    const response = await axiosClient.patch(
      `/api/user/password?userId=${userId}&oldPassword=${oldPasword}&newPassword=${newPassword}`
    );
    return response;
  },

  registerChildProfile: async (data) => {
    const response = await axiosClient.post("/api/user/vac-record", data);
    return response;
  },

  getAllChildProfile: async (id) => {
    const response = await axiosClient.get(
      `/api/user/vac-records?userId=${id}`
    );
    return response.reverse();
  },

  getChildById: async (id) => {
    const reponse = await axiosClient.get(`/api/user/vac-record?id=${id}`);
    return reponse;
  },

  updateChildProfile: async (data) => {
    const response = await axiosClient.patch("/api/user/vac-record", data);
    return response;
  },

  deleteChildProfile: async (id) => {
    const response = await axiosClient.delete(`/api/user/vac-record?id=${id}`);
    return response;
  },
  selfSchedule: async (id) => {
    const response = await axiosClient.get(`/api/user/schedule/${id}`);
    return response.data;
  },

  getFeedback: async (userId) => {
    const response = await axiosClient.get(`/api/feedback/customer/${userId}`);
    return response.data;
  },

  updateFeedback: async (id, data) => {
    const response = await axiosClient.patch(`/api/feedback/${id}`, data);
    return response.data;
  },

  deleteFeedback: async (id) => {
    const response = await axiosClient.delete(`/api/feedback/${id}`);
    return response.data;
  },

  getTransaction: async (id) => {
    const response = await axiosClient.get(`/api/payment-history/${id}`);
    return response.data;
  },

  getTransactionRefund: async (id) => {
    const response = await axiosClient.get(`/api/user/refund-record/${id}`);
    return response.data;
  },

  searchTransaction: async (userId, status, search) => {
    const response = await axiosClient.get(
      `/api/payment-history/${userId}/search?searchText=${search}&status=${status}`
    );
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await axiosClient.get(`/api/post-followup/${id}`);
    return response.data;
  },

  emailVerify: async (email, code) => {
    const response = await axiosClient.post(
      `/api/user/verify?email=${email}&code=${code}`
    );
    return response.data;
  },

  sendVerify: async (email) => {
    const response = await axiosClient.post(
      `/api/user/emailVerify?email=${email}`
    );
    return response.data;
  },

  getCancelSchedule: async (id) => {
    const response = await axiosClient.get(
      `/api/user/rejected-cancel-record/${id}`
    );
    return response.data;
  },
};
