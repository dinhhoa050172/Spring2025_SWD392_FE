import axiosClient from "./axiosClient.js";

const packageVaccineService = {
  createPackageVaccine: async (data) => {
    const response = await axiosClient.post(`/api/vaccine-packages`, data);
    return response;
  },
  getAllPackageVaccine: async (page, size) => {
    const response = await axiosClient.get(
      `/api/vaccine-packages?page=${page}&size=${size}`
    );
    return response;
  },
  getPackageVaccineById: async (id) => {
    const response = await axiosClient.get(`/api/vaccine-package?pid=${id}`);
    return response;
  },
  updatePackageVaccineBasic: async (data) => {
    const response = await axiosClient.patch(`/api/vaccine-package`, data);
    return response;
  },
  updateVaccineInPackageVaccine: async (id, data) => {
    const response = await axiosClient.patch(`/api/vaccine-package-details/${id}`, data);
    return response;
  },
  deletePackageVaccine: async (id) => {
    const response = await axiosClient.delete(`/api/vaccine-package?id=${id}`);
    return response;
  },
};

export default packageVaccineService;
