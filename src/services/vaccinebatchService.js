import axiosClient from "./axiosClient.js";

const vaccinbatchService = {
  getVaccinePatch: async (status) => {
    const response = await axiosClient.get(
      `/api/vaccine-batch/search?status=${status}`
    );
    return response;
  },

  importVaccineToColdStorage: async (data) => {
    const response = await axiosClient.post(`/api/vaccine-batch/assign`, data);
    return response;
  },
};
export default vaccinbatchService;
