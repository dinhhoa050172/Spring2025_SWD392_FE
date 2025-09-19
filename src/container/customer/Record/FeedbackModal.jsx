import { 
  Box, 
  Button, 
  CircularProgress, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import { FaStar, FaRegStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";

const FeedbackModal = ({
  showFeedbackModal,
  setShowFeedbackModal,
  feedbackText,
  setFeedbackText,
  rating,
  setRating,
  handleSubmitFeedback,
  isLoading,
}) => {
  return (
    <Dialog
      open={showFeedbackModal}
      onClose={() => setShowFeedbackModal(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 24
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: 'primary.main',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        py: 2
      }}>
        <Typography variant="h6">Đánh giá dịch vụ tiêm chủng</Typography>
        <IconButton 
          onClick={() => setShowFeedbackModal(false)} 
          sx={{ color: 'white' }}
        >
          <IoClose size={24} />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers sx={{ py: 3 }}>
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Mức độ hài lòng của bạn:
          </Typography>
          <Box display="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <IconButton
                key={star}
                onClick={() => setRating(star)}
                sx={{ p: 0.5 }}
              >
                {rating >= star ? (
                  <FaStar size={28} color="#ffc107" />
                ) : (
                  <FaRegStar size={28} color="#e0e0e0" />
                )}
              </IconButton>
            ))}
          </Box>
        </Box>
        
        <TextField
          label="Nhận xét chi tiết"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button 
          onClick={() => setShowFeedbackModal(false)}
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmitFeedback}
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
          sx={{
            minWidth: 120,
            fontWeight: 'bold'
          }}
        >
          {isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal;