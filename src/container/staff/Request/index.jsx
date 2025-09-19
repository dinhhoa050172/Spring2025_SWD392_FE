import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";
import { staffService } from "@src/services/staffService.js";
import { CircularProgress, Pagination } from "@mui/material";
import RequestTable from "./RequestTable";
import RequestDetailModal from "./RequestDetailModal";
import StatusTabs from "./StatusTabs";

export default function Request() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const staffId = localStorage.getItem("userId");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const requestsPerPage = 10;

  useEffect(() => {
    fetchRequests();
  }, []);
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await staffService.getAllCancelRequest();
      setRequests(response);
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status, notes) => {
    setLoading(true);
    try {
      const response = await staffService.changeStatusCancelRequest(
        id,
        status,
        staffId,
        notes
      );
      if (response.code === "200") {
        setModalOpen(false);
        toast.success(message.REQUEST_SUCCESS, {
          closeOnClick: true,
          autoClose: 3000,
        });
        fetchRequests();
      }
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === id ? { ...request, status } : request
        )
      );
    } catch (error) {
      console.error(message.REQUEST_ERROR, error);
      toast.error(message.REQUEST_ERROR, {
        closeOnClick: true,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const openDetailModal = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const closeDetailModal = () => {
    setSelectedRequest(null);
    setModalOpen(false);
  };

  const filteredRequests = requests.filter(
    (request) => request.status === selectedStatus
  );

  const indexOfLastRequest = currentPage * requestsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - requestsPerPage;
  const currentRequests = filteredRequests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleStatusTabChange = (status) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  if (requests.length === 0) {
    return (
      <div className="flex h-80 items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-500">
          Không có yêu cầu hủy lịch nào.
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Danh sách yêu cầu hủy lịch</h1>

      <StatusTabs
        selectedStatus={selectedStatus}
        handleStatusTabChange={handleStatusTabChange}
      />
      {loading ? (
        <div className="flex h-screen items-center justify-center">
          <CircularProgress size="6rem" />
        </div>
      ) : (
        <>
          <RequestTable
            requests={currentRequests}
            openDetailModal={openDetailModal}
          />
          <div className="flex justify-center mt-6">
            <Pagination
              count={Math.ceil(filteredRequests.length / requestsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </>
      )}

      <RequestDetailModal
        selectedRequest={selectedRequest}
        closeDetailModal={closeDetailModal}
        handleStatusChange={handleStatusChange}
        loading={loading}
        modalOpen={modalOpen}
      />
    </div>
  );
}
