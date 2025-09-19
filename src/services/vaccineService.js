import { data } from "react-router-dom";
import axiosClient from "./axiosClient.js";

const vaccineService = {
  getAllDiseaseType: async () => {
    const response = await axiosClient.get("/api/disease-types");
    return response;
  },
  getAllPriceVaccine: async () => {
    const response = await axiosClient.get("/api/vaccines/prices");
    return response.data;
  },
  getAllVaccine: async () => {
    const response = await axiosClient.get(`/api/vaccines`);
    return response.data;
  },
  getVaccineById: async (id) => {
    const response = await axiosClient.get(`/api/vaccines/${id}`);
    return response.data.content;
  },
  createVaccine: async (data) => {
    const response = await axiosClient.post("/api/vaccine", data);
    return response;
  },
  updateVaccine: async (data) => {
    const response = await axiosClient.patch(`/api/vaccine`, data);
    return response;
  },
  deleteVaccine: async (id) => {
    const response = await axiosClient.delete(`/api/vaccine/delete?id=${id}`);
    return response;
  },
  // ----------------------------------------------------------------------
  createTemplateDoseInterval: async (data) => {
    const res = await axiosClient.post("/api/template-dose-interval", data);
    return res
  },
  getAllTemplateDoseIntervalByVaccineId: async (id) => {
    const res = await axiosClient.get(`/api/template-dose-interval/by-vaccine/${id}`);
    return res;
  },

};
export default vaccineService;
