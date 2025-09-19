import { Modal, Box, TextField, Button, CircularProgress } from "@mui/material";
import { format } from "date-fns"; // Sử dụng date-fns để định dạng ngày
import { useState } from "react";
import { appointmentService } from "@src/services/appointmentService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

const RescheduleModal = ({ open, onClose, appointment, onRefresh }) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Ngày mai làm ngày tối thiểu

    const [newDate, setNewDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRescheduleAppointment = async () => {
        if (!newDate) {
            toast.error("Vui lòng chọn ngày mới!");
            return;
        }

        setIsLoading(true);
        try {
            // Giả sử API yêu cầu gửi appointmentDetailId và scheduledDate mới
            const response = await appointmentService.changeSchedule(
                appointment.appointmentDetailId,
                format(newDate, "yyyy-MM-dd"),
            );

            if (response.code === "200") {
                toast.success("Đổi lịch hẹn thành công!", {
                    autoClose: 1000,
                    hideProgressBar: true,
                });
                onRefresh(); // Làm mới bảng sau khi đổi lịch thành công
                onClose(); // Đóng modal
            } else {
                toast.error(message.UPDATE_ERROR);
            }
        } catch (error) {
            console.error(message.UPDATE_ERROR, error);
            toast.error(message.UPDATE_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box className="bg-white p-6 rounded-lg w-96 mx-auto mt-24 shadow-xl">
                <h2 className="text-xl font-bold mb-4">Đổi lịch</h2>
                <p className="mb-2">
                    Lịch cũ: {format(appointment?.scheduledDate || new Date(), "dd/MM/yyyy")}
                </p>
                <TextField
                    label="Chọn ngày mới"
                    type="date"
                    fullWidth
                    value={newDate ? format(newDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => setNewDate(new Date(e.target.value))}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    inputProps={{
                        min: format(tomorrow, "yyyy-MM-dd"), // Chỉ cho phép chọn từ ngày mai trở đi
                    }}
                    onKeyDown={(e) => e.preventDefault()} // Ngăn nhập tay
                />
                <div className="flex justify-end mt-4 space-x-2">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleRescheduleAppointment}
                        disabled={isLoading}
                    >
                        {isLoading ? <CircularProgress size={24} /> : "Xác nhận đổi lịch"}
                    </Button>
                    <Button variant="contained" color="error" onClick={onClose}>
                        Đóng
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};

export default RescheduleModal;