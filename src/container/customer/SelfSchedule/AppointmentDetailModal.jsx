import { formatDate } from "@utils/format.js";
import { Box, Modal } from "@mui/material";

const AppointmentDetailModal = ({
  selectedAppointment,
  setSelectedAppointment,
  showActionColumn,
  setShowActionColumn,
  isWithin24Hours,
  setShowRescheduleModal,
  setShowCancelModal,
  setSelectAppointmentDetail,
}) => {
  return (
    <Modal
      open={!!selectedAppointment}
      onClose={() => {
        setSelectedAppointment(null);
        setShowActionColumn(false);
      }}
    >
      <Box className="bg-white p-8 rounded-lg w-11/12 max-w-4xl mx-auto mt-12 shadow-xl max-h-[85vh] overflow-y-auto custom-scrollbar">
        {selectedAppointment && (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin chi tiết lịch hẹn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Tên trẻ:</strong> {selectedAppointment.childName}
                </p>
                <p className="text-gray-700">
                  <strong>Giới tính:</strong> {selectedAppointment.childGender === "M" ? "Nam" : "Nữ"}
                </p>
                <p className="text-gray-700">
                  <strong>Ngày sinh:</strong> {formatDate(selectedAppointment.dateOfBirth)}
                </p>
                <p className="text-gray-700">
                  <strong>Nơi sinh:</strong> {selectedAppointment.birthPlace}
                </p>
                <p className="text-gray-700">
                  <strong>Phương pháp sinh:</strong> {selectedAppointment.birthMethod}
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-gray-700">
                  <strong>Cân nặng lúc sinh:</strong> {selectedAppointment.birthWeight} kg
                </p>
                <p className="text-gray-700">
                  <strong>Chiều cao lúc sinh:</strong> {selectedAppointment.birthHeight} cm
                </p>
                <p className="text-gray-700">
                  <strong>Bất thường khi sinh:</strong> {selectedAppointment.abnormalities}
                </p>
                <p className="text-gray-700">
                  <strong>Thời gian tiêm:</strong> {selectedAppointment.timeFrom}
                </p>
              </div>
            </div>

            {selectedAppointment.appointmentDetails && selectedAppointment.appointmentDetails.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Danh sách vaccine</h3>
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="border border-gray-300 p-2">Vaccine</th>
                      <th className="border border-gray-300 p-2">Mũi tiêm thứ</th>
                      <th className="border border-gray-300 p-2">Trạng thái</th>
                      {showActionColumn && (
                        <th className="border border-gray-300 p-2">Thao tác</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAppointment.appointmentDetails.map((detail, index) => (
                      <tr key={index} className="text-center">
                        <td className="border border-gray-300 p-2">{detail.vaccineName}</td>
                        <td className="border border-gray-300 p-2">{detail.doseNumber}</td>
                        <td className="border border-gray-300 p-2">
                          <span
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              detail.status === "PENDING"
                                ? "bg-yellow-100 text-yellow-800"
                                : detail.status === "BANKED"
                                ? "bg-blue-100 text-blue-800"
                                : detail.status === "CHECKED_IN"
                                ? "bg-purple-100 text-purple-800"
                                : detail.status === "COMPLETED"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {detail.status}
                          </span>
                        </td>
                        {showActionColumn && (detail.status === "PENDING" || detail.status === "BANKED") && (
                          <td className="border border-gray-300 p-2">
                            <button
                              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200 mr-2"
                              onClick={() => {
                                setShowRescheduleModal(true);
                                setSelectAppointmentDetail(detail);
                              }}
                            >
                              Đổi lịch
                            </button>
                            <button
                              className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                              onClick={() => {
                                setShowCancelModal(true);
                                setSelectAppointmentDetail(detail);
                              }}
                            >
                              Hủy lịch
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              {isWithin24Hours(selectedAppointment.scheduledDate, selectedAppointment.timeFrom) ? (
                <p className="text-red-500 mt-2">
                  Chỉ thực hiện đổi lịch và hủy lịch trước 24h kể từ thời gian đăng ký tiêm.
                </p>
              ) : (
                <button
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                  onClick={() => setShowActionColumn(true)}
                >
                  Gửi yêu cầu
                </button>
              )}
              <button
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
                onClick={() => {
                  setSelectedAppointment(null);
                  setShowActionColumn(false);
                }}
              >
                Đóng
              </button>
            </div>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default AppointmentDetailModal;