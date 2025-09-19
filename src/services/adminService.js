import axiosClient from "./axiosClient.js";

const adminService = {
  getAllUser: async (page, size) => {
    const response = await axiosClient.get(
      `/api/admin/users?page=${page}&size=${size}`
    );
    return response;
  },
  banUser: async (id) => {
    const response = await axiosClient.patch(`/api/user/archive?userId=${id}`);
    return response;
  },
  unBanUser: async (id) => {
    const response = await axiosClient.patch(
      `/api/admin/unarchive?userId=${id}`
    );
    return response;
  },

  getDashboard: async (start, end) => {
    try {
      const response = await axiosClient.post("/api/admin/dashboard", {
        start,
        end,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  },

  getDashboardUser: async (start, end) => {
    const response = await axiosClient.get(`/api/admin/dashboard/user`, {
      start,
      end,
    });
    return response;
  },

  getDashboardBooking: async (start, end) => {
    const response = await axiosClient.get(`/api/admin/dashboard/booking`, {
      start,
      end,
    });
    return response;
  },

  getDashboardRevenue: async (start, end) => {
    const response = await axiosClient.get(`/api/admin/dashboard/revenue`, {
      start,
      end,
    });
    return response;
  },
};
export default adminService;
