import axiosClient from "./axiosClient.js";

export const appointmentService = {
  createAppointment: async (data) => {
    const response = await axiosClient.post("/api/appointment", data);
    return response;
  },
  updateStatus: async (id, status) => {
    try {
      const response = await axiosClient.patch("/api/appointment-detail", {
        id: id,
        status: status,
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  updatePostVaccinationInfo: async (data) => {
    try {
      const response = await axiosClient.post(`/api/post-followup`, data);
      return response;
    } catch (error) {
      console.error(error);
    }
  },
  cancelPackageVaccine: async (id, reason, userId) => {
    const response = await axiosClient.post(
      "/api/cancellation-records/cancel-appointment",
      { appointmentId: id, reason: reason, createdBy: userId }
    );
    return response;
  },

  cancelVaccine: async (id, reason, userId) => {
    const response = await axiosClient.post(
      "/api/cancellation-records/cancel-shot",
      { appointmentDetailId: id, reason: reason, createdBy: userId }
    );
    return response;
  },

  changeSchedule: async (id, date) => {
    const response = await axiosClient.patch("/api/appointment/reschedule", {
      appointment_id: id,
      new_schedule_date: date,
    });
    return response;
  },
  getAppointmentDetailsExpired: async () => {
    const response = await axiosClient.get(`/api/appointment-details/expired`);
    return response;
  },
  searchAppointmentDetails: async ({
    statuses,
    fullName = "",
    phoneNumber = "",
    childName = "",
    vaccineName = "",
    doseNumber = "",
    searchDate = "",
    page,
    size,
    sortBy = "ad.scheduledDate",
    direction = "asc",
  }) => {
    const url = `/api/appointment-details/find?fullName=${encodeURIComponent(
      fullName
    )}&phoneNumber=${encodeURIComponent(
      phoneNumber
    )}&childName=${encodeURIComponent(
      childName
    )}&vaccineName=${encodeURIComponent(
      vaccineName
    )}&doseNumber=${encodeURIComponent(
      doseNumber
    )}&statuses=${encodeURIComponent(statuses)}&searchDate=${encodeURIComponent(
      searchDate
    )}&page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`;

    try {
      const response = await axiosClient.get(url);
      return response;
    } catch (error) {
      console.error("Error searching appointment details:", error);
      throw error;
    }
  },

  sendFeedback: async (data) => {
    const response = await axiosClient.post("/api/feedback", data);
    return response;
  },

  //pay by cash
  createPayByCash: async (id) => {
    const response = await axiosClient.post(`/payment/cash?appointmentId=${id}`);
    return response;
  },
  paybycash: async (id) => {
    const response = await axiosClient.post(`/payment/cash/pay/${id}`);
    return response;
  },
};
