import axiosClient from "./axiosClient.js";

const vaccineImportInvoiceService = {
  create: (data) => {
    const response = axiosClient.post(`/api/vii`, data);
    return response;
  },
  getAllWithStatus: (page, size, status) => {
    const response = axiosClient.get(
      `/api/viis/line-items?page=${page}&size=${size}&sortBy=createdAt&sortDir=desc&status=${status}`
    );
    return response;
  },
  updateStatus: (data) => {
    const response = axiosClient.post(`/api/vii/confirm`, data);
    return response;
  },

  deleteInvoice: (id) => {
    const response = axiosClient.delete(`/api/vii/delete-draft/${id}`);
    return response;
  },
};
export default vaccineImportInvoiceService;
