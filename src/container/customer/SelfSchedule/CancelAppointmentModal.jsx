import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";

const CancelAppointmentModal = ({
  showCancelModal,
  setShowCancelModal,
  cancelReason,
  setCancelReason,
  handleCancelAppointment,
  isLoading,
}) => {
  return (
    <Modal open={showCancelModal} onClose={() => setShowCancelModal(false)}>
      <Box className="bg-white p-6 rounded-lg w-96 mx-auto mt-24 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Lý do hủy lịch</h2>
        <TextField
          label="Nhập lý do hủy"
          fullWidth
          multiline
          rows={3}
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <Button
            variant="contained"
            color="primary"
            onClick={handleCancelAppointment}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Xác nhận hủy"}
          </Button>
          <Button variant="contained" color="error" onClick={() => setShowCancelModal(false)}>
            Đóng
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default CancelAppointmentModal;