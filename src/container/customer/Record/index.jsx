import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
} from "@mui/material";
import { userService } from "@src/services/userService.js";
import { message } from "@utils/message.js";
import { formatDate, formatDateTime } from "@utils/format.js";
import PostDetailModel from "./PostDetailModel.jsx";
import FeedbackModal from "./FeedbackModal.jsx";
import { toast } from "react-toastify";
import { appointmentService } from "@src/services/appointmentService.js";

export default function Record() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [currentDetail, setCurrentDetail] = useState(null);
  const [detailData, setDetailData] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [rating, setRating] = useState(0);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await userService.selfSchedule(userId);

        const completedRecords = response
          .map((record) => ({
            ...record,
            appointmentDetails: record.appointmentDetails.filter(
              (detail) => detail.status === "COMPLETED"
            ),
          }))
          .filter((record) => record.appointmentDetails.length > 0);
        setRecords(completedRecords);
        setTotalItems(completedRecords.length); 
      } catch (error) {
        setError(message.ERROR_FETCH_DATA);
        console.error(message.ERROR_FETCH_DATA, error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [userId]);

  // Hàm nhóm các vaccine đã tiêm theo ngày và thời gian
  const groupVaccinesByDateTime = (records) => {
    const groupedData = {};

    records.forEach((record) => {
      const key = `${record.scheduledDate}-${record.timeFrom}`;

      if (!groupedData[key]) {
        groupedData[key] = {
          ...record,
          vaccines: [],
        };
      }

      record.appointmentDetails.forEach((detail) => {
        groupedData[key].vaccines.push(detail.vaccineName);
      });
    });

    return Object.values(groupedData);
  };

  const groupedRecords = groupVaccinesByDateTime(records);

  const startIndex = page * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRecords = groupedRecords.slice(startIndex, endIndex);

  const handleOpenDetailModal = async (record) => {
    setOpenDetailModal(true);
    setCurrentDetail(record);
    setDetailLoading(true);
    
    try {
      const details = await Promise.all(
        record.appointmentDetails.map(async (detail) => {
          const response = await userService.getRecordById(detail.id);
          return {
            vaccineName: detail.vaccineName,
            detail: response.content[0]
          };
        })
      );
      setDetailData(details);
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setCurrentDetail(null);
    setDetailData([]);
  };

  const handleOpenFeedbackModal = (record) => {
  setCurrentDetail(record);
  setShowFeedbackModal(true);
};

  const handleSubmitFeedback = async () => {
      if (!feedbackText || rating === 0) {
        toast.error(message.SELECT_FEDDBACK);
        return;
      }
  
      const feedbackData = {
        customerId: userId,
        feedbackText: feedbackText,
        rating: rating,
      };
  
      try {
        setFeedbackLoading(true);
        await appointmentService.sendFeedback(feedbackData);
        toast.success(message.FEDDBACK_SUCCESS, {
          autoClose: 3000,
          closeOnClick: true,
        });
        setShowFeedbackModal(false);
        setFeedbackText("");
        setRating(0);
      } catch (error) {
        console.error(message.FEDDBACK_ERROR, error);
        toast.error(message.FEDDBACK_ERROR + error.message, {
          autoClose: 3000,
          closeOnClick: true,
        });
      } finally {
        setFeedbackLoading(false);
      }
    };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <CircularProgress size="6rem" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 text-2xl mt-10">{error}</div>;
  }

  if (groupedRecords.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">
          Không có lịch sử tiêm chủng
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Danh sách Lần tiêm đã hoàn thành
      </h1>
      <h2 className="text-lg font-semibold mb-4 text-red-500">
        Nếu phát hiện các biểu hiện bất thường, nôn trớ, thở nhanh hay ngắt
        quãng, thở khò khè, da mẩn đỏ,… cần báo ngay cho nhân viên y tế gần
        nhất.
      </h2>

      <div className="mb-4">
        <label>Số lượng mỗi trang: </label>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          className="border rounded-md p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>{" "}
        / trang
      </div>

      {/* Bảng hiển thị dữ liệu */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ textAlign: "center", width: "3%" }}>
                STT
              </TableCell>
              <TableCell sx={{ width: "15%" }}>Tên trẻ</TableCell>
              <TableCell sx={{ width: "10%" }}>Ngày sinh</TableCell>
              <TableCell sx={{ width: "35%" }}>Vaccine đã tiêm</TableCell>
              <TableCell sx={{ width: "15%" }}>Ngày tiêm</TableCell>
              <TableCell sx={{ width: "22%", textAlign: "center" }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRecords.map((record, index) => (
              <TableRow key={index}>
                <TableCell sx={{ textAlign: "center" }}>
                  {startIndex + index + 1}
                </TableCell>
                <TableCell>{record.childName}</TableCell>
                <TableCell>{formatDate(record.dateOfBirth)}</TableCell>
                <TableCell>{record.vaccines.join(", ")}</TableCell>
                <TableCell>
                  {formatDate(record.scheduledDate)} {record.timeFrom}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    onClick={() => handleOpenDetailModal(record)}
                    sx={{ mr: 2 }}
                  >
                    Chi tiết
                  </Button>
                  <Button variant="contained" onClick={() => handleOpenFeedbackModal(record)}>Đánh giá</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Phân trang */}
      <div className="flex justify-center items-center mt-4">
        <div className="flex items-center gap-2">
          <Button
            variant="contained"
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            disabled={page === 0}
          >
            Trang trước
          </Button>
          <span>
            Trang {page + 1} / {Math.ceil(totalItems / pageSize)}
          </span>
          <Button
            variant="contained"
            onClick={() =>
              setPage((prev) =>
                Math.min(prev + 1, Math.ceil(totalItems / pageSize) - 1)
              )
            }
            disabled={page >= Math.ceil(totalItems / pageSize) - 1}
          >
            Trang tiếp
          </Button>
        </div>
      </div>

       <PostDetailModel
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        currentDetail={currentDetail}
        detailData={detailData}
        detailLoading={detailLoading}
        formatDate={formatDate}
        formatDateTime={formatDateTime}
      />

      <FeedbackModal
              showFeedbackModal={showFeedbackModal}
              setShowFeedbackModal={setShowFeedbackModal}
              feedbackText={feedbackText}
              setFeedbackText={setFeedbackText}
              rating={rating}
              setRating={setRating}
              handleSubmitFeedback={handleSubmitFeedback}
              isLoading={feedbackLoading}
            />
    </div>
  );
}