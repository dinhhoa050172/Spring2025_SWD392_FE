import { Button, Menu, MenuItem } from "@mui/material"; // Import thêm Menu và MenuItem từ MUI
import Pagination from "@components/Paging/index.jsx";
import CheckoutModal from "./CheckOutModal.jsx";
import RescheduleModal from "./RescheduleModal.jsx";
import LoadingSpinner from "@components/Loading/LoadingSnipper.jsx";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";
import { appointmentService } from "@src/services/appointmentService.js";
import { useEffect, useState } from "react";
import getStatusColor from "@utils/colorStatus.js";

const AppointmentTable = ({ selectedStatus, phoneNumber, currentPage, size, onPageChange, selectedDate }) => {
    const [loading, setLoading] = useState(false);
    const [appointments, setAppointments] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // State cho menu dropdown
    const [currentAppointmentId, setCurrentAppointmentId] = useState(null); // Lưu ID của appointment đang thao tác

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            let params = {
                page: currentPage,
                size: size,
                statuses: selectedStatus,
                phoneNumber: phoneNumber.trim() || undefined,
                searchDate: selectedDate,
            };
            const response = await appointmentService.searchAppointmentDetails(params);
            setAppointments(response.content || []);
            setTotalPages(response.totalPages || 0);
        } catch (error) {
            console.error(message.ERROR_FETCH_DATA, error);
            setAppointments([]);
            setTotalPages(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [selectedStatus, currentPage, size, phoneNumber, selectedDate]);

    const handleCheckIn = async (id) => {
        setLoadingBtn(true);
        try {
            const response = await appointmentService.updateStatus(id, "CHECKED_IN");
            if (response.code === "200") {
                toast.success(message.UPDATE_SUCCESS, { autoClose: 1000, hideProgressBar: true });
                fetchAppointments();
            } else {
                toast.error(message.UPDATE_ERROR);
            }
        } catch (error) {
            console.error(message.UPDATE_ERROR, error);
            toast.error(message.UPDATE_ERROR);
        } finally {
            setLoadingBtn(false);
        }
    };

    const handlePayment = async (id) => {
        setLoadingBtn(true);
        try {
            const response = await appointmentService.createPayByCash(id);
            if (response.code === "200") {
                const res = await appointmentService.paybycash(id);
                if (res.code === "200") {
                    toast.success(message.UPDATE_SUCCESS, { autoClose: 1000, hideProgressBar: true });
                    fetchAppointments();
                } else {
                    toast.error("Đã thanh toán");
                }
            } else {
                toast.error(message.UPDATE_ERROR);
            }
        } catch (error) {
            console.error(message.UPDATE_ERROR, error);
            toast.error(message.UPDATE_ERROR);
        } finally {
            setLoadingBtn(false);
        }
    };

    const handleCheckOut = (appointment) => {
        setSelectedAppointment(appointment);
        setOpenModal(true);
    };

    const handleChangeSchedule = (appointment) => {
        setSelectedAppointment(appointment);
        setShowRescheduleModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setSelectedAppointment(null);
    };

    const handleRescheduleModalClose = () => {
        setShowRescheduleModal(false);
        setSelectedAppointment(null);
    };

    // Xử lý mở/đóng menu dropdown
    const handleMenuOpen = (event, appointmentId) => {
        setAnchorEl(event.currentTarget);
        setCurrentAppointmentId(appointmentId); // Lưu ID của appointment để xử lý
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentAppointmentId(null);
    };

    if (loading) return <LoadingSpinner />;

    const now = new Date().toLocaleDateString('en-CA'); // 'en-CA' định dạng YYYY-MM-DD

    return (
        <div>
            {appointments.length > 0 ? (
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2 text-center">STT</th>
                            <th className="p-2 text-left">Tên khách hàng</th>
                            <th className="p-2 text-left">Số điện thoại</th>
                            <th className="p-2 text-left">Tên trẻ</th>
                            <th className="p-2 text-left">Tên vaccine</th>
                            <th className="p-2 text-left">Ngày và giờ hẹn</th>
                            <th className="p-2 text-left">Trạng thái</th>
                            <th className="p-2 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => (
                            <tr key={appointment.appointmentDetailId} className="border-t hover:bg-gray-100">
                                <td className="p-2 text-center">{currentPage * size + index + 1}</td>
                                <td className="p-2">{appointment.customerFullname || "N/A"}</td>
                                <td className="p-2">{appointment.customerPhoneNumber || "N/A"}</td>
                                <td className="p-2">{appointment.childName || "N/A"}</td>
                                <td className="p-2">{appointment.vaccineName || "N/A"}</td>
                                <td className="p-2">
                                    {(appointment.scheduledDate) || "N/A"} {" "}
                                    {appointment.timeFrom || "N/A"}
                                </td>
                                <td className="p-2">
                                    <span
                                        className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                            appointment.status
                                        )}`}
                                    >
                                        {appointment.status || "N/A"}
                                    </span>
                                </td>
                                <td className="p-2 flex gap-2">
                                    {appointment.status === "BANKED" && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => handleMenuOpen(e, appointment.appointmentDetailId)}
                                                disabled={loadingBtn}
                                            >
                                                Thao tác
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl) && currentAppointmentId === appointment.appointmentDetailId}
                                                onClose={handleMenuClose}
                                            >{appointment.scheduledDate === now && (
                                                <MenuItem
                                                    onClick={() => {
                                                        handleCheckIn(appointment.appointmentDetailId);
                                                        handleMenuClose();
                                                    }}
                                                    disabled={appointment.status !== "BANKED" || loadingBtn}
                                                >
                                                    Sẵn sàng tiêm
                                                </MenuItem>)}
                                                <MenuItem
                                                    onClick={() => {
                                                        handleChangeSchedule(appointment);
                                                        handleMenuClose();
                                                    }}
                                                >
                                                    Đổi lịch tiêm
                                                </MenuItem>

                                            </Menu>
                                        </>
                                    )}
                                    {appointment.status === "CHECKED_IN" && (
                                        <button
                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            onClick={() => handleCheckOut(appointment)}
                                            disabled={appointment.status !== "CHECKED_IN"}
                                        >
                                            Kiểm tra sau tiêm
                                        </button>
                                    )}
                                    {appointment.status === "PENDING" && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => handleMenuOpen(e, appointment.appointmentDetailId)}
                                                disabled={loadingBtn}
                                            >
                                                Thao tác
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl) && currentAppointmentId === appointment.appointmentDetailId}
                                                onClose={handleMenuClose}
                                            >{appointment.scheduledDate === now && (
                                                <MenuItem
                                                    onClick={() => {
                                                        handlePayment(appointment.appointmentDetailId);
                                                        handleMenuClose();
                                                    }}
                                                    disabled={loadingBtn}
                                                >
                                                    Thanh toán
                                                </MenuItem>)}
                                                <MenuItem
                                                    onClick={() => {
                                                        handleChangeSchedule(appointment);
                                                        handleMenuClose();
                                                    }}
                                                >
                                                    Đổi lịch tiêm
                                                </MenuItem>

                                            </Menu>
                                        </>
                                    )}

                                    {appointment.status === "PAID_BY_CASH" && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={(e) => handleMenuOpen(e, appointment.appointmentDetailId)}
                                                disabled={loadingBtn}
                                            >
                                                Thao tác
                                            </Button>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl) && currentAppointmentId === appointment.appointmentDetailId}
                                                onClose={handleMenuClose}
                                            >{appointment.scheduledDate === now && (
                                                <MenuItem
                                                    onClick={() => {
                                                        handleCheckIn(appointment.appointmentDetailId);
                                                        handleMenuClose();
                                                    }}
                                                    disabled={appointment.status !== "PAID_BY_CASH" || loadingBtn}
                                                >
                                                    Sẵn sàng tiêm
                                                </MenuItem>)}
                                                <MenuItem
                                                    onClick={() => {
                                                        handleChangeSchedule(appointment);
                                                        handleMenuClose();
                                                    }}
                                                >
                                                    Đổi lịch tiêm
                                                </MenuItem>

                                            </Menu>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-gray-500">Không có cuộc hẹn nào được tìm thấy.</p>
            )}

            {totalPages > 0 && (
                <div className="mt-4 flex justify-center">
                    <Pagination
                        currentPage={currentPage + 1}
                        totalPages={totalPages}
                        onPageChange={(newPage) => onPageChange(newPage)}
                    />
                </div>
            )}

            {selectedAppointment && (
                <CheckoutModal
                    open={openModal}
                    onClose={handleModalClose}
                    appointment={selectedAppointment}
                    onRefresh={fetchAppointments}
                />
            )}

            {selectedAppointment && (
                <RescheduleModal
                    open={showRescheduleModal}
                    onClose={handleRescheduleModalClose}
                    appointment={selectedAppointment}
                    onRefresh={fetchAppointments}
                />
            )}
        </div>
    );
};

export default AppointmentTable;