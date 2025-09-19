import axiosClient from "./axiosClient.js";

export const staffService = {
  getAllBlog: async (page, size) => {
    const response = await axiosClient.get(
      `/api/staff/blogs?page=${page}&size=${size}&sort=created_at&direction=desc`
    );
    return response.data;
  },
  getDetailBlog: async (id) => {
    const response = await axiosClient.get(`/api/staff/blog?blogId=${id}`);
    return response.data;
  },
  createBlog: async (data) => {
    const response = await axiosClient.post("/api/staff/blog", data);
    return response;
  },
  updateBlog: async (data) => {
    const response = await axiosClient.patch("/api/staff/blog", data);
    return response;
  },
  deleteBlog: async (id) => {
    const response = await axiosClient.delete(`/api/staff/blog?blogId=${id}`);
    return response;
  },

  getAllCancelRequest: async () => {
    const response = await axiosClient.get("/api/cancellation-records");
    return response;
  },

  getCancelRequestById: async (id) => {
    const response = await axiosClient.get(`/api/cancellation-records/${id}`);
    return response;
  },

  changeStatusCancelRequest: async (id, status, staffId, notes) => {
    const response = await axiosClient.patch(
      `/api/cancellation-records/${id}`,
      { status: status, processedBy: staffId, reason: notes }
    );
    return response;
  },
};
