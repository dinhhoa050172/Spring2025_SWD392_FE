import { useState, useEffect } from "react";
import CreateRequestImportInvoice from "./CreateRequestImportInvoice.jsx";
import vaccineImportInvoiceService from "@src/services/vaccineImportInvoice.js";
import InvoiceTable from "./InvoiceTable.jsx";
import InvoiceDetailModal from "./InvoiceDetailModal.jsx";
import ConfirmDeleteModal from "@components/ModalDelete/index.jsx";
import { message } from "@utils/message.js";
import { toast } from "react-toastify";

const RequestImportInvoice = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [invoiceToDelete, setInvoiceToDelete] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [status, setStatus] = useState("DRAFT");

    const getRequestImportInvoice = async () => {
        try {
            const response = await vaccineImportInvoiceService.getAllWithStatus(page, size, status);
            if (response.code === "200") {
                setInvoices(response.data.data.content);
            }
            return response;
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getRequestImportInvoice();
    }, [page, size, status]);

    const handleDelete = (invoice) => {
        setInvoiceToDelete(invoice);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!invoiceToDelete) return;
        
        try {
            setIsDeleting(true);
            const response = await vaccineImportInvoiceService.deleteInvoice(invoiceToDelete.id);
            if (response.code === "200") {
                await getRequestImportInvoice();
                toast.success(message.DELETE_SUCCESS, {
                    autoClose: 4000,
                    closeOnClick: true,
                });
            }
        } catch (error) {
            console.error(message.DELETE_ERROR, error);
            toast.error(message.DELETE_ERROR + " " + error.message, {
                autoClose: 4000,
                closeOnClick: true,
            });
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setInvoiceToDelete(null);
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setInvoiceToDelete(null);
    };

    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setIsDetailModalOpen(true);
    };

    const handleStatusChange = (status) => {
        setStatus(status);
        setPage(0);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý yêu cầu nhập kho</h1>
                <div className="flex gap-4">
                    {/* Nút chọn trạng thái */}
                    <div className="flex border-b border-gray-200">
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${status === "DRAFT"
                                ? "bg-yellow-100 text-yellow-800 border-b-2 border-yellow-500"
                                : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-800"
                                }`}
                            onClick={() => handleStatusChange("DRAFT")}
                        >
                            Chờ duyệt
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${status === "CONFIRMED"
                                ? "bg-green-100 text-green-800 border-b-2 border-green-500"
                                : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                                }`}
                            onClick={() => handleStatusChange("CONFIRMED")}
                        >
                            Đã duyệt
                        </button>
                        <button
                            className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${status === "CANCELLED"
                                ? "bg-red-100 text-red-800 border-b-2 border-red-500"
                                : "text-gray-600 hover:bg-red-50 hover:text-red-800"
                                }`}
                            onClick={() => handleStatusChange("CANCELLED")}
                        >
                            Bị từ chối
                        </button>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Gửi yêu cầu nhập vaccine
                    </button>
                </div>
            </div>

            {/* Invoice Table */}
            <InvoiceTable
                invoices={invoices}
                handleViewDetails={handleViewDetails}
                handleDelete={handleDelete}
            />

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
                        {/* Overlay */}
                        <div
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                            onClick={() => setIsCreateModalOpen(false)}
                        ></div>

                        {/* Modal content */}
                        <div className="relative bg-white rounded-lg max-w-4xl w-full mx-auto">
                            <CreateRequestImportInvoice
                                isOpen={isCreateModalOpen}
                                onClose={() => setIsCreateModalOpen(false)}
                                refreshData={getRequestImportInvoice}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            <InvoiceDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                invoice={selectedInvoice}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmDeleteModal
                isOpen={isDeleteModalOpen}
                onConfirm={confirmDelete}
                onCancel={cancelDelete}
                message="Bạn có chắc chắn muốn xóa yêu cầu nhập kho này không?"
                loadingBtn={isDeleting}
            />
        </div>
    );
};

export default RequestImportInvoice;