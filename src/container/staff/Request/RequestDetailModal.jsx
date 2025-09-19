import { useState } from 'react';
import { 
  Box, Modal, CircularProgress, Chip, Divider, 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  Button, TextField, Typography 
} from "@mui/material";
import { 
  FiUser, FiClock, FiAlertCircle, 
  FiCheck, FiX, FiDollarSign,
  FiChevronRight, FiCalendar, FiEdit3
} from "react-icons/fi";
import { FaRegSadTear, FaRegSmile } from "react-icons/fa";
import { formatDateTime } from "@utils/format.js";

const RequestDetailModal = ({
  selectedRequest,
  closeDetailModal,
  handleStatusChange,
  loading,
  modalOpen
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleRejectClick = () => {
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    handleStatusChange(selectedRequest.id, "REJECTED", rejectReason);
    setShowRejectModal(false);
    setRejectReason('');
  };

  const handleRejectCancel = () => {
    setShowRejectModal(false);
    setRejectReason('');
  };

  const parseReason = (reasonJson, status) => {
  try {
    const reasonObj = JSON.parse(reasonJson);
    
    if (!reasonObj) return reasonJson;
    
    // Nếu ở trạng thái PENDING hoặc APPROVED, chỉ hiển thị reasonCancelled
    if (status === "PENDING" || status === "APPROVED") {
      return reasonObj.reasonCancelled || reasonJson;
    }
    
    // Nếu ở trạng thái khác (REJECTED), hiển thị cả 2 lý do
    return (
      <>
        {reasonObj.reasonCancelled && (
          <div className="mb-2">
            <span className="font-semibold">Lý do hủy từ khách: </span>
            {reasonObj.reasonCancelled}
          </div>
        )}
        {reasonObj.reasonStaffRejected && (
          <div>
            <span className="font-semibold">Lý do từ chối từ nhân viên: </span>
            {reasonObj.reasonStaffRejected}
          </div>
        )}
      </>
    );
  } catch (e) {
    return reasonJson;
  }
};

  return (
    <>
      <Modal open={!!modalOpen} onClose={closeDetailModal}>
        <Box sx={{
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: '12px',
          width: '90%',
          maxWidth: '600px',
          mx: 'auto',
          my: '10vh',
          boxShadow: 24,
          position: 'relative'
        }}>
          <button
            onClick={closeDetailModal}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX size={24} />
          </button>

          {selectedRequest && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <FiAlertCircle className="mr-2 text-yellow-500" />
                Chi tiết yêu cầu hủy lịch
              </h2>
              
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FiUser className="text-blue-500 mr-2" />
                    <h3 className="font-semibold text-gray-700">Thông tin khách hàng</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <FiChevronRight className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Tên khách hàng</p>
                        <p className="font-medium">{selectedRequest.customerName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiCalendar className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Thời gian hủy</p>
                        <p className="font-medium">
                          {formatDateTime(selectedRequest.cancellationTime)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <FiAlertCircle className="text-blue-500 mr-2" />
                    <h3 className="font-semibold text-gray-700">Chi tiết yêu cầu</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <FiChevronRight className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Lý do hủy</p>
                        <p className="font-medium">{parseReason(selectedRequest.reason, selectedRequest.status)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiChevronRight className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Trạng thái</p>
                        <Chip
                          label={selectedRequest.status === "PENDING" ? "Chờ xử lý" :
                            selectedRequest.status === "APPROVED" ? "Duyệt" : "Từ chối"}
                          size="small"
                          icon={
                            selectedRequest.status === "PENDING" ? <FiClock className="ml-1" /> :
                            selectedRequest.status === "APPROVED" ? <FiCheck className="ml-1" /> :
                            <FiX className="ml-1" />
                          }
                          sx={{
                            backgroundColor: 
                              selectedRequest.status === "PENDING" ? 'warning.light' :
                              selectedRequest.status === "APPROVED" ? 'success.light' :
                              'error.light',
                            color: 
                              selectedRequest.status === "PENDING" ? 'warning.dark' :
                              selectedRequest.status === "APPROVED" ? 'success.dark' :
                              'black',
                            fontWeight: 500,
                            mt: 0.5
                          }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FiChevronRight className="text-gray-400 mt-1 mr-2" />
                      <div>
                        <p className="text-sm text-gray-500">Số tiền hoàn lại</p>
                        <p className="font-medium flex items-center">
                          <FiDollarSign className="mr-1 text-green-500" />
                          {selectedRequest.refundAmount.toLocaleString()} VND
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedRequest.status === "PENDING" && (
                  <>
                    <Divider />
                    <div className="flex justify-end space-x-4">
                      <button
                        onClick={handleRejectClick}
                        disabled={loading}
                        className="flex items-center px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <>
                            <FaRegSadTear className="mr-2" />
                            Từ chối
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedRequest.id, "APPROVED", "")}
                        disabled={loading}
                        className="flex items-center px-6 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50"
                      >
                        {loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <>
                            <FaRegSmile className="mr-2" />
                            Chấp nhận
                          </>
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </Box>
      </Modal>

      <Dialog 
        open={showRejectModal} 
        onClose={handleRejectCancel}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'error.light', 
          color: 'error.contrastText',
          display: 'flex',
          alignItems: 'center',
          py: 2
        }}>
          <FiEdit3 style={{ marginRight: '12px', fontSize: '1.5rem' }} />
          <Typography variant="h6" fontWeight="bold">
            Nhập lý do từ chối
          </Typography>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, mt:2 }}>
          <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
            Vui lòng nhập lý do từ chối yêu cầu hủy lịch của khách hàng:
          </Typography>
          
          <TextField
            autoFocus
            fullWidth
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            multiline
            rows={4}
            placeholder="Nhập lý do từ chối (tối thiểu 5 ký tự)..."
            inputProps={{ minLength: 5 }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                '&:hover fieldset': {
                  borderColor: 'error.main',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'error.main',
                },
              }
            }}
          />
          
          <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
            Lý do cần rõ ràng và đầy đủ (tối thiểu 5 ký tự)
          </Typography>
        </DialogContent>
        
        <DialogActions sx={{ 
          px: 3, 
          py: 2,
          borderTop: '1px solid',
          borderColor: 'divider'
        }}>
          <Button 
            onClick={handleRejectCancel}
            variant="outlined"
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1,
              mr: 2
            }}
          >
            Hủy bỏ
          </Button>
          <Button 
            onClick={handleRejectConfirm}
            color="error"
            variant="contained"
            disabled={!rejectReason.trim() || rejectReason.trim().length < 20}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              px: 3,
              py: 1,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
                backgroundColor: 'error.dark'
              }
            }}
          >
            Xác nhận từ chối
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RequestDetailModal;