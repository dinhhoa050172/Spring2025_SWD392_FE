import { useEffect, useState } from "react";
import { CircularProgress } from "@mui/material";
import packageVaccineService from "@src/services/packageVaccineService.js";
import { message } from "@utils/message.js";
import Pagination from "@components/Paging/index.jsx";
import EditPackageVaccine from "./EditPackageVaccine.jsx";
import { toast } from "react-toastify";
import ConfirmDeleteModal from "@components/ModalDelete/index.jsx";

const TablePackageVaccine = ({ refreshTrigger }) => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editPackage, setEditPackage] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const pageSize = 10;

    useEffect(() => {
        fetchPackages(currentPage);
    }, [currentPage, refreshTrigger]);

    const fetchPackages = async (page) => {
        try {
            setLoading(true);
            const response = await packageVaccineService.getAllPackageVaccine(page, pageSize);
            if (response.data.length !== 0) {
                setPackages(response.data);
            } else {
                setPackages([]);
            }
            setTotalPages(response.paging.totalPages || 1);
        } catch (error) {
            console.error(message.ERROR_FETCH_DATA, error);
            setPackages([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await packageVaccineService.deletePackageVaccine(deleteConfirm);
            if (response) {
                toast.success(message.DELETE_SUCCESS);
                fetchPackages(currentPage);
                setDeleteConfirm(null);
            }
        } catch (error) {
            toast.error(message.DELETE_ERROR);
            console.error(message.DELETE_ERROR, error);
        }
    };

    const handleUpdate = () => {
        fetchPackages(currentPage);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-2xl">
                <CircularProgress size="6rem" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Danh sách gói Vaccine</h2>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 shadow-md">
                    <thead>
                        <tr className="bg-gray-100 border-b">
                            <th className="px-4 py-2 text-left w-[20%]">Tên gói</th>
                            <th className="px-4 py-2 text-left w-[25%]">Mô tả</th>
                            <th className="px-4 py-2 text-left w-[15%]">Tổng giá</th>
                            <th className="px-4 py-2 text-left w-[30%]">Chi tiết vaccine</th>
                            <th className="px-4 py-2 text-left w-[10%]">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="overflow-y-auto max-h-[60vh]">
                        {packages.length > 0 ? (
                            packages.map((pkg) => (
                                <tr key={pkg.vaccinePackageId} className="border-b">
                                    <td className="px-4 py-2">{pkg.vaccinePackageName}</td>
                                    <td className="px-4 py-2">{pkg.description}</td>
                                    <td className="px-4 py-2">{pkg.totalPrice.toLocaleString()} VND</td>
                                    <td className="px-4 py-2">
                                        <ul className="list-disc pl-4">
                                            {pkg.vaccineLineServiceDTO.map((vaccine, index) => (
                                                <li key={index}>
                                                    {vaccine.vaccineName} ({vaccine.diseaseName}) - {vaccine.doseNumber} liều
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => setEditPackage(pkg)}
                                            className="text-white hover:text-black mr-2 bg-blue-600 p-2 rounded-md"
                                        >
                                            Sửa
                                        </button>
                                        {/* <button
                                            onClick={() => (setDeleteConfirm(pkg.vaccinePackageId))}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Xóa
                                        </button> */}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-4 py-2 text-center text-gray-500">
                                    Không có dữ liệu
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center mt-4 space-x-2">
                <Pagination
                    currentPage={currentPage}
                    onPageChange={(page) => setCurrentPage(page)}
                    totalPages={totalPages}
                />
            </div>

            {/* Edit Modal */}
            <EditPackageVaccine
                packageData={editPackage}
                open={!!editPackage}
                onClose={() => setEditPackage(null)}
                onUpdate={handleUpdate}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={!!deleteConfirm}
                loadingBtn={""}
                message={"Bạn có chắc chắn muốn xóa gói vaccine này không ?"}
                onCancel={() => setDeleteConfirm(null)}
                onConfirm={handleDelete}
            />
        </div>
    );
};

export default TablePackageVaccine;