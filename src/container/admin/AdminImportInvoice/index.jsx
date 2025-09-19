// RequestImportInvoice.jsx
import { useState, useEffect } from "react";
import vaccineImportInvoiceService from "@src/services/vaccineImportInvoice.js";
import InvoiceTable from "./InvoiceTable.jsx";
import InvoiceDetailModal from "./InvoiceDetailModal.jsx";
import { data } from "react-router-dom";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

const RequestImportInvoice = () => {
    const [invoices, setInvoices] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);
    const [status, setStatus] = useState("DRAFT");
    const userId = localStorage.getItem("userId");

    const getRequestImportInvoice = async () => {
        try {
            const response = await vaccineImportInvoiceService.getAllWithStatus(page, size, status);
            console.log(response.data);
            if (response.code === "200") {
                setInvoices(response.data.data.content);
            }
            return response;
        } catch (error) {
            console.error(message.ERROR_FETCH_DATA, error);
        }
    };

    useEffect(() => {
        getRequestImportInvoice();
    }, [page, size, status]); // Re-fetch when page, size, or status changes

    const handleAction = async (id, status) => {
        try {
            const submitData = {
                invoiceId: id,
                status: status,
                confirmedBy: userId
            }
            const response = await vaccineImportInvoiceService.updateStatus(submitData);
            if (response.code === "200") {
                getRequestImportInvoice();
                toast.success(message.UPDATE_SUCCESS,{
                    autoClose: 4000,
                    closeOnClick: true,
                });
            } else {
                toast.error(message.UPDATE_ERROR, {
                    autoClose: 4000,
                    closeOnClick: true,
                });
            }
        } catch (error) {
            console.error(error)
        }
    };

    const handleViewDetails = (invoice) => {
        setSelectedInvoice(invoice);
        setIsDetailModalOpen(true);
    };

    const handleStatusChange = (status) => {
        setStatus(status);
        setPage(0); // Reset về trang đầu khi thay đổi trạng thái
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Quản lý yêu cầu nhập kho</h1>
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
                        Đồng ý
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${status === "CANCELLED"
                            ? "bg-red-100 text-red-800 border-b-2 border-red-500"
                            : "text-gray-600 hover:bg-red-50 hover:text-red-800"
                            }`}
                        onClick={() => handleStatusChange("CANCELLED")}
                    >
                        Từ chối
                    </button>
                </div>
            </div>

            {/* Invoice Table */}
            <InvoiceTable
                invoices={invoices}
                handleViewDetails={handleViewDetails}
                handleAction={handleAction}
            />

            {/* Detail Modal */}
            <InvoiceDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                invoice={selectedInvoice}
            />
        </div>
    );
};

export default RequestImportInvoice;