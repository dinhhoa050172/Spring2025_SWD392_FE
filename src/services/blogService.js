import axiosClient from "./axiosClient.js";

export const blogService = {
  getAllBlog: async (page) => {
    const response = await axiosClient.get(
      `/api/user/blogs?page=${page - 1}&size=10&sort=created_at&direction=desc`
    );
    return response.data;
  },

  getBlogSection: async () => {
    const response = await axiosClient.get(
      `/api/user/blogs?page=0&size=4&sort=created_at&direction=desc`
    );
    return response.data;
  },

  getDetailBlog: async (id) => {
    const response = await axiosClient.get(`/api/user/blog?blogId=${id}`);
    return response;
  },

  acceptBlog: async (id) => {
    const response = await axiosClient.patch(
      `/api/manager/blog/publish?blogId=${id}`
    );
    return response;
  },

  rejectBlog: async (id) => {
    const response = await axiosClient.patch(
      `/api/manager/blog/reject?blogId=${id}`
    );
    return response;
  },
};
