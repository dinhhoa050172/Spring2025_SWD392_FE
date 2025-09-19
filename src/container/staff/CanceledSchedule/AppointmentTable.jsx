import { useState, useEffect } from "react";
import getStatusColor from "@utils/colorStatus.js";
import { message } from "@utils/message.js";
import { toast } from "react-toastify";
import Pagination from "@components/Paging/index.jsx";
import LoadingSpinner from "@components/Loading/LoadingSnipper.jsx";
import { appointmentService } from "@src/services/appointmentService.js";
import RescheduleModal from "../Schedule/RescheduleModal.jsx";

const AppointmentTable = ({ currentPage, pageSize, onPageChange }) => {
  const [loading, setLoading] = useState(false);
  const [allAppointments, setAllAppointments] = useState([]);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const totalItems = allAppointments.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = allAppointments.slice(startIndex, endIndex);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentService.getAppointmentDetailsExpired();
      // Lọc ra các appointment có status khác "CHECKED_IN"
      const filteredAppointments = (response.data || []).filter(
        (appointment) => appointment.status !== "CHECKED_IN"
      );
      setAllAppointments(filteredAppointments);
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
      setAllAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (id) => {
    setLoadingBtn(true);
    try {
      const response = await appointmentService.updateStatus(id, "CANCELLED");
      if (response.code === "200") {
        toast.success(message.UPDATE_SUCCESS, {
          autoClose: 3000,
          closeOnClick: true,
        });
        fetchAppointments();
      } else {
        toast.error(message.UPDATE_ERROR, {
          autoClose: 3000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error(message.UPDATE_ERROR, error);
      toast.error(message.UPDATE_ERROR, {
        autoClose: 3000,
        closeOnClick: true,
      });
    } finally {
      setLoadingBtn(false);
    }
  };

  // Hàm mở modal đổi lịch
  const handleOpenReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  // Hàm đóng modal đổi lịch
  const handleCloseReschedule = () => {
    setRescheduleModalOpen(false);
    setSelectedAppointment(null);
  };

  // Hàm làm mới dữ liệu sau khi đổi lịch thành công
  const handleRefresh = () => {
    fetchAppointments();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="overflow-x-auto rounded-lg">
      {currentData.length > 0 ? (
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                STT
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Tên khách hàng
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Số điện thoại
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Tên trẻ
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Tên vaccine
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Ngày và giờ hẹn
              </th>
              <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentData.map((appointment, index) => (
              <tr
                key={appointment.appointmentDetailId}
                className="hover:bg-gray-200 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {appointment.customerName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {appointment.customerPhoneNumber || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {appointment.childName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {appointment.vaccineName || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {appointment.scheduledDate || "N/A"}{" "}
                  {appointment.timeFrom || "N/A"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {appointment.status || "N/A"}
                  </span>
                </td>
                <td className="p-2 flex gap-2">
                  {appointment.status === "PENDING" && (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          handleCancelAppointment(
                            appointment.appointmentDetailId
                          )
                        }
                        disabled={
                          appointment.status !== "PENDING" || loadingBtn
                        }
                      >
                        {loadingBtn ? "Đang xử lý..." : "Hủy lịch hẹn"}
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleOpenReschedule(appointment)}
                      >
                        Đổi lịch
                      </button>
                    </>
                  )}

                  {appointment.status === "BANKED" && (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          handleCancelAppointment(
                            appointment.appointmentDetailId
                          )
                        }
                        disabled={appointment.status !== "BANKED" || loadingBtn}
                      >
                        {loadingBtn ? "Đang xử lý..." : "Hủy lịch hẹn"}
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleOpenReschedule(appointment)}
                      >
                        Đổi lịch
                      </button>
                    </>
                  )}

                  {appointment.status === "PAID_BY_CASH" && (
                    <>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() =>
                          handleCancelAppointment(
                            appointment.appointmentDetailId
                          )
                        }
                        disabled={appointment.status !== "PAID_BY_CASH" || loadingBtn}
                      >
                        {loadingBtn ? "Đang xử lý..." : "Hủy lịch hẹn"}
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleOpenReschedule(appointment)}
                      >
                        Đổi lịch
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-black text-center">
          Không có cuộc hẹn nào được tìm thấy.
        </p>
      )}

      {totalPages > 0 && totalItems > pageSize && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
       <RescheduleModal
        open={rescheduleModalOpen}
        onClose={handleCloseReschedule}
        appointment={selectedAppointment}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default AppointmentTable;
