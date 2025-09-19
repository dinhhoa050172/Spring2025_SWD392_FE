// StaffColdStorage.jsx
import { useEffect, useState } from "react";
import coldStorageService from "@src/services/coldStorageService.js";
import ColdStorageModal from "./ColdStorageModal.jsx";
import { Button, Menu, MenuItem } from "@mui/material";
import ColdStorageCreateModal from "./ColdStorageCreateModal.jsx";
import Pagination from "@components/Paging/index.jsx";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";
import ConfirmDeleteModal from "@components/ModalDelete/index.jsx";

const StaffColdStorage = () => {
  const [coldStorages, setColdStorages] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [modalMode, setModalMode] = useState("view");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [currentStorageId, setCurrentStorageId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loadingBtnDelte, setLoadingBtnDelte] = useState(false);

  const getAllColdStorage = async () => {
    try {
      const response = await coldStorageService.getAll(page, size);
      setTotalPages(response.totalPages);
      setColdStorages(response.content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllColdStorage();
  }, [page]);

  const handleMenuOpen = (event, storageId) => {
    setAnchorEl(event.currentTarget);
    setCurrentStorageId(storageId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentStorageId(null);
  };

  const handleAction = (storage, action) => {
    setSelectedStorage(storage);
    setModalMode(action);
    setIsModalOpen(true);
    handleMenuClose();
  };

  const handleToggleStatus = async (storage) => {
    try {
      if (!storage.isActive === false && storage.currentVialCount > 0) {
        toast.error(message.CHANGE_STATUS_COLD_STORAGE_ERROR, {
          closeOnClick: true,
          autoClose: 3000,
        });
        return;
      }
      setLoading(true);
      const updatedStorage = {
        ...storage,
        isActive: !storage.isActive,
      };
      await coldStorageService.update(updatedStorage);
      toast.success(message.UPDATE_SUCCESS, {
        closeOnClick: true,
        autoClose: 3000,
      });
      getAllColdStorage();
      handleMenuClose();
    } catch (error) {
      console.log(error);
      toast.error(message.UPDATE_ERROR, {
        closeOnClick: true,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (storageId) => {
    const storage = coldStorages.find(s => s.id === storageId);
    
    // Kiểm tra nếu kho có vaccine
    if (storage.currentVialCount > 0) {
        toast.error('Không thể xóa kho vì vẫn còn vaccine tồn tại', {
            autoClose: 4000,
            closeOnClick: true,
        });
        handleMenuClose();
        return;
    }
    
    handleMenuClose();
    setDeleteConfirm(storageId);
};

  const handleDelete = async () => {
    try {
      setLoadingBtnDelte(true);
      const response = await coldStorageService.delete(deleteConfirm);
      if (response.code === "200") {
        toast.success(message.DELETE_SUCCESS, {
          autoClose: 4000,
          closeOnClick: true,
        });
        getAllColdStorage();
        setDeleteConfirm(null);
      } else {
        toast.error(message.DELETE_ERROR);
      }
    } catch (error) {
      toast.error(message.DELETE_ERROR, {
        autoClose: 4000,
        closeOnClick: true,
      });
      console.error(message.DELETE_ERROR, error);
    } finally {
      setLoadingBtnDelte(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản Lý Kho Lạnh</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Thêm Kho Lạnh Mới
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">Tên Kho</th>
              <th className="py-2 px-4 border-b text-left">Loại</th>
              <th className="py-2 px-4 border-b text-left">Nhà Sản Xuất</th>
              <th className="py-2 px-4 border-b text-left">Sức Chứa</th>
              <th className="py-2 px-4 border-b text-left">Số Lọ Hiện Có</th>
              <th className="py-2 px-4 border-b text-left">Trạng Thái</th>

              <th className="py-2 px-4 border-b text-left">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {coldStorages.map((storage) => (
              <tr key={storage.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">
                  {storage.coldStorageName}
                </td>
                <td className="py-2 px-4 border-b">{storage.type}</td>
                <td className="py-2 px-4 border-b">{storage.manufacturer}</td>
                <td className="py-2 px-4 border-b">
                  {storage.storageCapacity}
                </td>
                <td className="py-2 px-4 border-b">
                  {storage.currentVialCount}
                </td>
                <td className="py-2 px-4 border-b">
                  {storage.isActive ? "Hoạt động" : "Tạm dừng"}
                </td>
                <td className="py-2 px-4 border-b">
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={(e) => handleMenuOpen(e, storage.id)}
                    >
                      Hành Động
                    </Button>
                    <Menu
                      anchorEl={anchorEl}
                      open={
                        Boolean(anchorEl) && currentStorageId === storage.id
                      }
                      onClose={handleMenuClose}
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                    >
                      {storage.isActive ? (
                        <MenuItem
                          onClick={() => handleToggleStatus(storage)}
                          sx={{
                            color: "red",
                            fontWeight: "bold",
                            backgroundColor: "rgba(255, 0, 0, 0.1)",
                          }}
                          disabled={loading}
                        >
                          Tắt
                        </MenuItem>
                      ) : (
                        <MenuItem
                          onClick={() => handleToggleStatus(storage)}
                          sx={{
                            color: "green",
                            fontWeight: "bold",
                            backgroundColor: "rgba(0, 128, 0, 0.1)",
                          }}
                          disabled={loading}
                        >
                          Bật
                        </MenuItem>
                      )}
                      <MenuItem onClick={() => handleAction(storage, "view")}>
                        Xem Chi Tiết
                      </MenuItem>
                      <MenuItem onClick={() => handleDeleteClick(storage.id)}>
                        Xóa
                      </MenuItem>
                    </Menu>
                  </>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 0 && (
          <div className="flex justify-center mt-4">
            <Pagination
              currentPage={page + 1}
              totalPages={totalPages}
              onPageChange={(newPage) => setPage(newPage - 1)}
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <ColdStorageModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          storage={selectedStorage}
          refreshData={getAllColdStorage}
        />
      )}
      {isCreateModalOpen && (
        <ColdStorageCreateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          refreshData={getAllColdStorage}
        />
      )}
      <ConfirmDeleteModal
        isOpen={!!deleteConfirm}
        onConfirm={() => handleDelete()}
        loadingBtn={loadingBtnDelte}
        message={"Bạn có chắc chắn muốn xóa kho lạnh này?"}
        onCancel={() => (setDeleteConfirm(null), setLoadingBtnDelte(false))}
      />
    </div>
  );
};

export default StaffColdStorage;
