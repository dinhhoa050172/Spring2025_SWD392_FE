import { useEffect, useState } from "react";
import diseaseTypeService from "@src/services/diseaseTypeService.js";
import CreateDiseaseType from "./CreateDiseaseType.jsx";
import EditDiseaseType from "./EditDiseaseType.jsx";
import Pagination from "@components/Paging/index.jsx";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";
import ConfirmDeleteModal from "@components/ModalDelete/index.jsx";
import LoadingSpinner from "@components/Loading/LoadingSnipper.jsx";

const AdminDiseaseType = () => {
  const [diseaseType, setDiseaseType] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(5);
  const [editingDisease, setEditingDisease] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loadingBtnDelete, setLoadingBtnDelte] = useState(false);
  const [loading, setLoading] = useState(false);

  const getAllDiseaseType = async () => {
    try {
      setLoading(true);
      const response = await diseaseTypeService.getAll(page, size);
      setDiseaseType(response.data.content);
      setTotalPages(response.data.totalPages || 5);
      setLoading(false);
    } catch (error) {
      console.log(message.ERROR_FETCH_DATA, error);
    }
  };

  useEffect(() => {
    getAllDiseaseType();
  }, [page]);

  const handlePageChange = (newPage) => {
    const backendPage = newPage - 1;
    setPage(backendPage);
  };

  const handleDelete = (id) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = async () => {
    try {
      setLoadingBtnDelte(true);
      const response = await diseaseTypeService.delete(deleteConfirm);
      if (response.code === "200") {
        getAllDiseaseType();
        toast.success(message.DELETE_SUCCESS);
        setLoadingBtnDelte(false);
      } else {
        toast.error(message.DELETE_ERROR);
      }
    } catch (error) {
      console.error("Error deleting disease type:", error);
      toast.error(message.DELETE_ERROR);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleEdit = (disease) => {
    setEditingDisease(disease);
  };

  const handleUpdate = () => {
    setEditingDisease(null);
    getAllDiseaseType();
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Quản lý loại bệnh
        </h1>
        <CreateDiseaseType onCreate={getAllDiseaseType} />
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="w-3/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  STT
                </th>
                <th className="w-3/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Tên loại bệnh
                </th>
                <th className="w-3/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Mô tả
                </th>
                <th className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Ngày tạo
                </th>
                <th className="w-2/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Ngày cập nhật
                </th>
                <th className="w-1/12 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {diseaseType.length > 0 ? (
                diseaseType.map((disease, index) => (
                  <tr key={disease.id} className="hover:bg-gray-50">
                    <td className="w-3/12 px-6 py-4 text-sm text-gray-900">
                      {page * size + index + 1}
                    </td>
                    <td className="w-3/12 px-6 py-4 text-sm text-gray-900">
                      {disease.name}
                    </td>
                    <td className="w-3/12 px-6 py-4 text-sm text-gray-500">
                      {disease.description || "Không có mô tả"}
                    </td>
                    <td className="w-2/12 px-6 py-4 text-sm text-gray-500">
                      {new Date(disease.createdAt).toLocaleDateString()}
                    </td>
                    <td className="w-2/12 px-6 py-4 text-sm text-gray-500">
                      {disease.updatedAt
                        ? new Date(disease.updatedAt).toLocaleDateString()
                        : "Chưa từng cập nhật"}
                    </td>
                    <td className="w-2/12 px-6 py-4 text-base flex  ">
                      <button
                        onClick={() => handleEdit(disease)}
                        className="text-white hover:text-black mr-2 bg-blue-600 p-2 rounded-md"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDelete(disease.id)}
                        className="text-white hover:text-black bg-red-600 p-2 rounded-md"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex justify-center items-center space-x-2">
        <Pagination
          currentPage={page + 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      {/* Edit Modal */}
      {editingDisease && (
        <EditDiseaseType
          disease={editingDisease}
          onUpdate={handleUpdate}
          onCancel={() => setEditingDisease(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={!!deleteConfirm}
        onConfirm={confirmDelete}
        loadingBtn={loadingBtnDelete}
        onCancel={() => setDeleteConfirm(null)}
        message="Bạn có chắc chắn muốn xóa loại bệnh này không?"
      />
    </div>
  );
};

export default AdminDiseaseType;
