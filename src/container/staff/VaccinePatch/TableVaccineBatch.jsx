import Pagination from "@components/Paging/index.jsx";
import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import VaccineBatchDetailModal from "./ModalVaccineBatch.jsx";
import StorageSelectionModal from "./StorageSelectionModal.jsx";
import vaccinbatchService from "@src/services/vaccinebatchService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

const TableVaccineBatch = ({ vaccineBatch, refreshData  }) => {
  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Mặc định 10 items mỗi trang
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentVaccineBatchId, setCurrentVaccineBatchId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [storageModalOpen, setStorageModalOpen] = useState(false);
  const [selectedBatchForStorage, setSelectedBatchForStorage] = useState(null);

  // Tính toán tổng số trang
  const totalItems = vaccineBatch.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Lấy dữ liệu cho trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = vaccineBatch.slice(startIndex, endIndex);

  // Xử lý thay đổi page size
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1); // Reset về trang 1 khi thay đổi page size
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleMenuOpen = (event, vaccineBatchId) => {
    setAnchorEl(event.currentTarget);
    setCurrentVaccineBatchId(vaccineBatchId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentVaccineBatchId(null);
  };

  const handleViewDetails = (batchId) => {
    const batch = vaccineBatch.find((item) => item.id === batchId);
    setSelectedBatch(batch);
    setOpenModal(true);
    handleMenuClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedBatch(null);
  };

  const handleStoreToStorage = (batchId) => {
    const batch = vaccineBatch.find((item) => item.id === batchId);
    if (batch) {
      setSelectedBatchForStorage(batch);
      setStorageModalOpen(true);
      handleMenuClose();
    }
  };

  const handleConfirmStorage = async (storageId) => {
    try {
        const data = {
            vaccineBatchStorageAssignments: [
                {
                    vaccineBatchId: selectedBatchForStorage.id,
                    coldStorageId: storageId
                }
            ]
        };

        // Gọi API để cập nhật kho lạnh cho vaccine batch
        const response = await vaccinbatchService.importVaccineToColdStorage(data);
        
        if (response.code === "200" || response.status === 200) {
           toast.success(message.IMPORT_VACCINE_TO_COLD_STORAGE_SUCCESS,{
            autoClose: 3000,
            closeOnClick: true,
           });
           if (refreshData) {
               await refreshData();
           }
        } else {
            toast.error(message.IMPORT_VACCINE_TO_COLD_STORAGE_ERROR + " " + response.data[0], {
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    } catch (error) {
        console.error(message.IMPORT_VACCINE_TO_COLD_STORAGE_ERROR, error);
       toast.error(message.IMPORT_VACCINE_TO_COLD_STORAGE_ERROR + " " + error.data[0],{
        autoClose: 3000,
        closeOnClick: true,
       });
    } finally {
        setSelectedBatchForStorage(null);
        setStorageModalOpen(false);
    }
};

  return (
    <div>
      {/* Page Size Selector */}
      <div className="flex items-center space-x-2 mb-4">
        <label htmlFor="pageSize" className="text-sm text-gray-700">
          Số lượng:
        </label>
        <select
          id="pageSize"
          value={pageSize}
          onChange={handlePageSizeChange}
          className="mt-1 block w-20 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
      {/* Table */}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              STT
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tên Vaccine
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Số Lô
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kho Chứa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng Thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành Động
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentData.length > 0 ? (
            currentData.map((batch, index) => (
              <tr key={batch.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {(currentPage - 1) * pageSize + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {batch.vaccineName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {batch.batchNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {batch.coldStorageId || "Chưa thêm vào kho"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {batch.status === "AVAILABLE" && "Sẵn sàng"}
                  {batch.status === "SOLD OUT" && "Hết Vaccine"}
                  {batch.status === "UNAVAILABLE" && "Tạm ngưng"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => handleMenuOpen(e, batch.id)}
                    >
                      Thao tác
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={
                        Boolean(anchorEl) && currentVaccineBatchId === batch.id
                      }
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={() => handleViewDetails(batch.id)}>
                        Xem chi tiết
                      </MenuItem>
                      <MenuItem>Tạm ngưng</MenuItem>
                      <MenuItem onClick={() => handleStoreToStorage(batch.id)}>
                        Cất vào kho
                      </MenuItem>
                    </Menu>
                  </>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="6"
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
              >
                Không tìm thấy lô vaccine nào
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalItems > 0 && (
        <div className="flex justify-center px-4 py-3 bg-white border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      )}

      {/* Modal Chi tiết */}
      <VaccineBatchDetailModal
        open={openModal}
        onClose={handleCloseModal}
        batch={selectedBatch}
      />

      {selectedBatchForStorage && (
        <StorageSelectionModal
          open={storageModalOpen}
          onClose={() => setStorageModalOpen(false)}
          vaccineBatch={selectedBatchForStorage}
          onConfirm={handleConfirmStorage}
        />
      )}
    </div>
  );
};

export default TableVaccineBatch;
