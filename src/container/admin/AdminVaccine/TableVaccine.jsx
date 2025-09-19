import { useEffect, useState } from 'react';
import vaccineService from '@src/services/vaccineService.js';
import { Button, CircularProgress, Menu, MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import { message } from '@utils/message.js';
import EditVaccine from './EditVaccine.jsx';
import ConfirmDeleteModal from '@components/ModalDelete/index.jsx';
import Pagination from '@components/Paging/index.jsx';
import ViewVaccineIntervalModal from './ViewVaccineIntervalModal.jsx';

const VaccineTable = ({ refreshTrigger }) => {
  const [vaccineData, setVaccineData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [editVaccine, setEditVaccine] = useState(null);
  const [modalViewIntervalOpen, setModalViewIntervalOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loadingBtnDelete, setLoadingBtnDelete] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentVaccineId, setCurrentVaccineId] = useState(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await vaccineService.getAllVaccine();
      if (response) {
        setVaccineData(response || []);
        setTotalItems(response.length || 0);
        setTotalPages(Math.ceil(response.length / pageSize) || 1);
      }
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
      setVaccineData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger, pageSize]);

  useEffect(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = vaccineData.slice(startIndex, endIndex);
    setDisplayedData(paginatedData);
    setTotalPages(Math.ceil(vaccineData.length / pageSize) || 1);
  }, [page, pageSize, vaccineData]);

  const handleUpdate = async () => {
    fetchData();
  };

  const handleDeleteClick = (vaccineId) => {
    handleMenuClose();
    setDeleteConfirm(vaccineId);
  };

  const handleDelete = async () => {
    try {
      setLoadingBtnDelete(true);
      const response = await vaccineService.deleteVaccine(deleteConfirm);
      if (response.code === '200') {
        toast.success(message.DELETE_SUCCESS, {
          autoClose: 4000,
          closeOnClick: true,
        });
        fetchData();
      }
    } catch (error) {
      toast.error(message.DELETE_ERROR);
      console.error(message.DELETE_ERROR, error);
    } finally {
      setLoadingBtnDelete(false);
      setDeleteConfirm(null);
      handleMenuClose();
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleMenuOpen = (event, vaccineId) => {
    setAnchorEl(event.currentTarget);
    setCurrentVaccineId(vaccineId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentVaccineId(null);
  };

  const handleOpenViewIntervalModal = (vaccine) => {
    setSelectedVaccine(vaccine);
    setModalViewIntervalOpen(true);
    handleMenuClose();
  };

  const handleCloseViewIntervalModal = () => {
    setModalViewIntervalOpen(false);
    setSelectedVaccine(null);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl">
        <CircularProgress size="6rem" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Danh sách Vaccine</h2>

      {/* Page Size Selector */}
      <div className="mb-4">
        <label className="mr-2">Số lượng:</label>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
          className="border rounded-md p-1"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>{' '}
        / trang
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full bg-white border border-gray-300 shadow-md">
          <thead className="bg-gray-200">
            <tr className="text-left text-gray-700">
              <th className="p-3 border text-center" style={{ width: '100px' }}>
                STT
              </th>
              <th className="p-3 border text-center" style={{ width: '200px' }}>
                Tên Vaccine
              </th>
              <th className="p-3 border text-center" style={{ width: '295px' }}>
                Loại Vaccine
              </th>
              <th className="p-3 border text-center" style={{ width: '180px' }}>
                Nhà sản xuất
              </th>
              <th className="p-3 border text-center" style={{ width: '90px' }}>
                Xuất xứ
              </th>
              <th className="p-3 border text-center" style={{ width: '115px' }}>
                Thể tích (ml)
              </th>
              <th className="p-3 border text-center" style={{ width: '80px' }}>
                Số liều mỗi lọ
              </th>
              <th className="p-3 border text-center" style={{ width: '160px' }}>
                Giá mỗi liều (VND)
              </th>
              <th className="p-3 border text-center" style={{ width: '120px' }}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedData.length > 0 ? (
              displayedData.map((vaccine, index) => (
                <tr key={vaccine.id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{(page - 1) * pageSize + index + 1}</td>

                  <td className="p-3">{vaccine.vaccineName}</td>
                  <td className="p-3">{vaccine.vaccineType}</td>
                  <td className="p-3">{vaccine.manufacturer}</td>
                  <td className="p-3 text-center">{vaccine.countryOfOrigin}</td>
                  <td className="p-3 text-center">{vaccine.doseVolume}</td>
                  <td className="p-3 text-center">{vaccine.dosesPerVial}</td>
                  <td className="p-3 text-center">
                    {vaccine.pricePerDose?.toLocaleString() || 0} VND
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={(e) => handleMenuOpen(e, vaccine.id)}
                      >
                        Thao tác
                      </Button>
                      <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl) && currentVaccineId === vaccine.id}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={() => handleOpenViewIntervalModal(vaccine)}>
                          Xem chi tiết khoảng cách mũi tiêm
                        </MenuItem>
                        <MenuItem onClick={() => setEditVaccine(vaccine)}>
                          Sửa vaccine
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteClick(vaccine.id)}>
                          Xóa
                        </MenuItem>
                      </Menu>
                    </>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-3 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-2 space-x-2">
        <Pagination
          currentPage={page}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>

      {/* Edit Modal */}
      <EditVaccine
        vaccine={editVaccine}
        open={!!editVaccine}
        onClose={() => setEditVaccine(null)}
        onUpdate={handleUpdate}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteConfirm}
        onConfirm={() => handleDelete()}
        loadingBtn={loadingBtnDelete}
        message={'Bạn có chắc chắn muốn xóa vaccine này?'}
        onCancel={() => {
          setDeleteConfirm(null);
          setLoadingBtnDelete(false);
          handleMenuClose();
        }}
      />

      {/* Các modal khác... */}
      <ViewVaccineIntervalModal
        open={modalViewIntervalOpen}
        onClose={handleCloseViewIntervalModal}
        vaccineId={selectedVaccine?.id}
      />
    </div>
  );
};

export default VaccineTable;