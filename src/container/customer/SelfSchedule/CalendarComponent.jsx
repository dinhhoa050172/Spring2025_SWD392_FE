import { useState, useEffect } from "react";
import { userService } from "@src/services/userService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";
import { useNavigate } from "react-router-dom";
import routes from "@src/router/index.js";
import AppointmentTable from "./AppointmentTable.jsx";
import AppointmentDetailModal from "./AppointmentDetailModal.jsx";
import CancelAppointmentModal from "./CancelAppointmentModal.jsx";
import RescheduleAppointmentModal from "./RescheduleAppointmentModal.jsx";
import { addDays, format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";
import { appointmentService } from "@src/services/appointmentService.js";

const AppointmentSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectAppointmentDetail, setSelectAppointmentDetail] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState(null);
  const [showActionColumn, setShowActionColumn] = useState(false);
  const tomorrow = addDays(new Date(), 1);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const response = await userService.selfSchedule(userId);
      if (response !== null) {
        setAppointments(response);
      }
      setLoading(false);
    };
    fetchAppointments();
  }, []);

  const isWithin24Hours = (scheduledDate, timeFrom) => {
    const now = new Date();
    const scheduledDateTime = new Date(`${scheduledDate}T${timeFrom}`);
    const timeDifference = scheduledDateTime - now;
    return timeDifference < 24 * 60 * 60 * 1000;
  };

  const handleCancelAppointment = async () => {
    setShowActionColumn(false);
    if (!selectAppointmentDetail) {
      toast.error(message.CANCEL_ERROR);
      return;
    }
    try {
      setIsLoading(true);
        const cancelSchedule = await appointmentService.cancelVaccine(
          selectAppointmentDetail.id,
          cancelReason,
          userId
        );

        if (cancelSchedule.id){
          toast.success(message.CANCEL_SUCCESS,{
            autoClose: 3000,
            closeOnClick: true
          });
          setShowCancelModal(false);
          setSelectedAppointment(null);
      }

      const response = await userService.selfSchedule(userId);
      if (response !== null) {
        setAppointments(response);
      }
    } catch (error) {
      console.error(message.CANCEL_ERROR, error);
      toast.error(message.CANCEL_ERROR + error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRescheduleAppointment = async () => {
    setShowActionColumn(false);
    if (!newDate) {
      toast.error(message.SELECT_DATE);
      return;
    }

    try {
      setIsLoading(true);
      await appointmentService.changeSchedule(
        selectAppointmentDetail.id,
        format(newDate, "yyyy-MM-dd")
      );
      toast.success(message.CHANGE_SCHEDULE_SUCCESS, {
        autoClose: 3000,
        closeOnClick: true,
      });
      setShowRescheduleModal(false);
      setSelectedAppointment(null);
      const response = await userService.selfSchedule(userId);
      if (response.message !== "Failed") {
        setAppointments(response);
      }
    } catch (error) {
      console.error(message.CHANGE_SCHEDULE_ERROR, error);
      toast.error(message.CHANGE_SCHEDULE_ERROR + error.data, {
        autoClose: 3000,
        closeOnClick: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const paymentStatus = new URLSearchParams(window.location.search).get("payment");

    if (paymentStatus === "success") {
      toast.success(message.PAYMENT_SUCCESS, {
        autoClose: 4000,
        closeOnClick: true,
      });
      setTimeout(() => navigate(routes.user.selfSchedule), 1000);
    } else if (paymentStatus !== null) {
      toast.error(message.PAYMENT_ERROR, {
        autoClose: 4000,
        closeOnClick: true,
      });
    }
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        <CircularProgress size="6rem" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        Chưa có lịch tiêm chủng
      </div>
    );
  }

  return (
    <div className="p-6">
      <AppointmentTable
        appointments={appointments}
        currentWeek={currentWeek}
        setCurrentWeek={setCurrentWeek}
        setSelectedAppointment={setSelectedAppointment}
      />

      <AppointmentDetailModal
  selectedAppointment={selectedAppointment}
  setSelectedAppointment={setSelectedAppointment}
  showActionColumn={showActionColumn}
  setShowActionColumn={setShowActionColumn}
  isWithin24Hours={isWithin24Hours}
  setShowRescheduleModal={setShowRescheduleModal}
  setShowCancelModal={setShowCancelModal}
  setSelectAppointmentDetail={setSelectAppointmentDetail}
/>

      <CancelAppointmentModal
        showCancelModal={showCancelModal}
        setShowCancelModal={setShowCancelModal}
        cancelReason={cancelReason}
        setCancelReason={setCancelReason}
        handleCancelAppointment={handleCancelAppointment}
        isLoading={isLoading}
      />

      <RescheduleAppointmentModal
        showRescheduleModal={showRescheduleModal}
        setShowRescheduleModal={setShowRescheduleModal}
        newDate={newDate}
        setNewDate={setNewDate}
        selectedAppointment={selectedAppointment}
        handleRescheduleAppointment={handleRescheduleAppointment}
        isLoading={isLoading}
        tomorrow={tomorrow}
      />
    </div>
  );
};

export default AppointmentSchedule;