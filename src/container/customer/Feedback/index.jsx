import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Box,
  Rating,
  Chip,
  useTheme,
  IconButton
} from "@mui/material";
import { userService } from "@src/services/userService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message";
import { FaStar, FaRegStar, FaEdit, FaTrash } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { formatDateTime } from "@utils/format.js";

const Feedback = () => {
  const theme = useTheme();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [editFeedbackText, setEditFeedbackText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);
  const [isEditLoading, setEditLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await userService.getFeedback(userId);
        setFeedbacks(response);
      } catch (error) {
        setError(message.ERROR_FETCH_DATA);
        console.error(message.ERROR_FETCH_DATA, error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  const handleOpenDeleteModal = (id) => {
    setFeedbackToDelete(id);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setFeedbackToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!feedbackToDelete) return;

    try {
      setDeleteLoading(true);
      await userService.deleteFeedback(feedbackToDelete);
      toast.success(message.DELETE_SUCCESS,{
        autoClose: 3000,
        closeOnClick: true,
      });
      setFeedbacks(
        feedbacks.filter((feedback) => feedback.id !== feedbackToDelete)
      );
    } catch (error) {
      console.error(message.DELETE_ERROR, error);
      toast.error(message.DELETE_ERROR,{
        autoClose: 3000,
        closeOnClick: true,
      });
    } finally {
      setDeleteLoading(false);
      handleCloseDeleteModal();
    }
  };

  const handleOpenEditModal = (feedback) => {
    setSelectedFeedback(feedback);
    setEditFeedbackText(feedback.feedbackText);
    setEditRating(feedback.rating);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedFeedback(null);
    setEditFeedbackText("");
    setEditRating(0);
  };

  const handleUpdateFeedback = async () => {
    if (!selectedFeedback) return;

    try {
      setEditLoading(true);
      const updatedFeedback = {
        feedbackText: editFeedbackText,
        rating: editRating,
      };
      await userService.updateFeedback(selectedFeedback.id, updatedFeedback);
      toast.success(message.UPDATE_SUCCESS,{
        autoClose: 3000,
        closeOnClick: true,
      });

      setFeedbacks(
        feedbacks.map((feedback) =>
          feedback.id === selectedFeedback.id
            ? { ...feedback, ...updatedFeedback }
            : feedback
        )
      );

      handleCloseEditModal();
    } catch (error) {
      console.error(message.UPDATE_ERROR, error);
      toast.error(message.UPDATE_ERROR,{
        autoClose: 3000,
        closeOnClick: true,
      });
    } finally {
      setEditLoading(false);
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 2) return 'warning';
    return 'error';
  };

  if (loading) {
    return (
      <Box display="flex" height="80vh" alignItems="center" justifyContent="center">
        <CircularProgress size={80} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Box display="flex" height="60vh" alignItems="center" justifyContent="center">
        <Typography variant="h5" color="textSecondary">
          Không có đánh giá nào
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Danh sách Đánh giá
      </Typography>

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: theme.palette.primary.light }}>
            <TableRow>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '5%' }} align="center">
                STT
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '40%' }}>
                Nội dung
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '15%' }}>
                Đánh giá
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }}>
                Ngày tạo
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold', width: '20%' }} align="center">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbacks.map((feedback, index) => (
              <TableRow 
                key={feedback.id} 
                hover 
                sx={{ '&:nth-of-type(even)': { bgcolor: theme.palette.action.hover } }}
              >
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap>
                    {feedback.feedbackText}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Chip
                      label={feedback.rating}
                      color={getRatingColor(feedback.rating)}
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Rating
                      value={feedback.rating}
                      readOnly
                      precision={0.5}
                      size="small"
                      emptyIcon={<FaRegStar fontSize="inherit" />}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  {formatDateTime(feedback.createdAt)}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => handleOpenEditModal(feedback)}
                    startIcon={<FaEdit />}
                    sx={{ mr: 1 }}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleOpenDeleteModal(feedback.id)}
                    startIcon={<FaTrash />}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={editModalOpen}
        onClose={handleCloseEditModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.primary.main, color: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Chỉnh sửa Đánh giá</Typography>
            <IconButton onClick={handleCloseEditModal} sx={{ color: 'white' }}>
              <IoClose />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <TextField
            label="Nội dung đánh giá"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editFeedbackText}
            onChange={(e) => setEditFeedbackText(e.target.value)}
            sx={{ my: 3 }}
          />
          <Typography variant="subtitle1" gutterBottom>
            Mức độ hài lòng:
          </Typography>
          <Rating
            value={editRating}
            onChange={(event, newValue) => setEditRating(newValue)}
            size="large"
            icon={<FaStar style={{ color: theme.palette.warning.main }} />}
            emptyIcon={<FaRegStar style={{ color: theme.palette.grey[400] }} />}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseEditModal}
            variant="outlined"
            color="primary"
            sx={{ mr: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleUpdateFeedback}
            variant="contained"
            color="primary"
            disabled={isEditLoading}
            startIcon={isEditLoading ? <CircularProgress size={20} /> : null}
          >
            {isEditLoading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteModalOpen}
        onClose={handleCloseDeleteModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: theme.palette.error.main, color: 'white' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Xác nhận xóa</Typography>
            <IconButton onClick={handleCloseDeleteModal} sx={{ color: 'white' }}>
              <IoClose />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3, my: 2 }}>
          <Typography variant="body1">
            Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={handleCloseDeleteModal}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleteLoading}
            startIcon={isDeleteLoading ? <CircularProgress size={20} /> : null}
          >
            {isDeleteLoading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Feedback;