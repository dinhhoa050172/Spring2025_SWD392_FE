import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";
import { format } from "date-fns";

const RescheduleAppointmentModal = ({
  showRescheduleModal,
  setShowRescheduleModal,
  newDate,
  setNewDate,
  selectedAppointment,
  handleRescheduleAppointment,
  isLoading,
  tomorrow,
}) => {
  return (
    <Modal open={showRescheduleModal} onClose={() => setShowRescheduleModal(false)}>
      <Box className="bg-white p-6 rounded-lg w-96 mx-auto mt-24 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Đổi lịch</h2>
        <p className="mb-2">Lịch cũ: {format(selectedAppointment?.scheduledDate || new Date(), "dd/MM/yyyy")}</p>
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
            min: format(tomorrow, "yyyy-MM-dd"),
          }}
          onKeyDown={(e) => e.preventDefault()}
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
          <Button variant="contained" color="error" onClick={() => setShowRescheduleModal(false)}>
            Đóng
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default RescheduleAppointmentModal;