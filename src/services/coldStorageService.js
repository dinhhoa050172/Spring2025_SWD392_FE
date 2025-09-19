import axiosClient from "./axiosClient.js";

const coldStorageService = {
  getAll: async (page, size) => {
    const response = await axiosClient.get(
      `/api/cold-storages?page=${page}&size=${size}`
    );
    return response;
  },
  getAllColdStorages: async () => {
    const response = await axiosClient.get(`/api/cold-storages`);
    return response;
  },
  getById: async (id) => {
    const response = await axiosClient.get(`/api/cold-storage?id=${id}`);
    return response;
  },
  create: async (data) => {
    const response = await axiosClient.post(`/api/cold-storage`, data);
    return response;
  },
  update: async (data) => {
    const response = await axiosClient.patch(`/api/cold-storage`, data);
    return response;
  },
  delete: async (id) => {
    const response = await axiosClient.delete(`/api/cold-storage?id=${id}`);
    return response;
  },

  getVaccineFromColdStorage: async (id) => {
    const response = await axiosClient.get(
      `/api/vaccine-batches/cold-storage-with-vaccine?id=${id}`
    );
    return response.data;
  },
};
export default coldStorageService;
