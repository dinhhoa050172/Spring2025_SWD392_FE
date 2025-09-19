import axiosClient from "./axiosClient.js";

const diseaseTypeService = {
    getAll: (page, size) => {
        const response = axiosClient.get(`/api/disease-types?page=${page}&size=${size}`);
        return response;
    },
    getDetail: (id) => {
        const response = axiosClient.get(`/api/disease-types/${id}`);
        return response;
    },
    create: (data) => {
        const response = axiosClient.post(`/api/disease-type`, data);
        return response;
    },
    update: (data) => {
        const response = axiosClient.patch(`/api/disease-type`, data);
        return response;
    },
    delete: (id) => {
        const response = axiosClient.delete(`/api/disease-type?id=${id}`);
        return response;
    },
};
export default diseaseTypeService;