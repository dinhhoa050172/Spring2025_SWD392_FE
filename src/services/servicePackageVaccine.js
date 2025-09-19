import axiosClient from "./axiosClient.js";

export const servicePackageVaccine = {
  getAllPackageVaccine: async (page, size) => {
    const response = await axiosClient.get(
      `/api/vaccine-packages?page=${page}&size=${size}`
    );
    return response;
  },

  getAllVaccineAndPackage: async () => {
    const reponse = await axiosClient.get("/api/vaccines-basic");
    return reponse.data;
  },
};
