// InvoiceTable.jsx
import { useState } from "react";
import { formatMoney } from "@utils/format.js";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const InvoiceTable = ({ invoices, handleViewDetails, handleAction }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentInvoiceId, setCurrentInvoiceId] = useState(null);

    const handleMenuOpen = (event, invoiceId) => {
        setAnchorEl(event.currentTarget);
        setCurrentInvoiceId(invoiceId);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentInvoiceId(null);
    };

    const handleMenuAction = (invoice, action) => {
        if (action === "view") {
            handleViewDetails(invoice);
        } else {
            handleAction(invoice.id, action);
        }
        handleMenuClose();
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Tên nhà cung cấp</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Tổng tiền</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Liên hệ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[20%]">Địa chỉ</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">Trạng thái</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Ghi chú</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">Thao tác</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td className="px-6 py-4 whitespace-nowrap">{invoice.supplierName || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{formatMoney(invoice.totalAmount) || 0}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{invoice.supplierContact || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{invoice.supplierAddress || "N/A"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceStatus ==="DRAFT" ? "Chờ xử lý" : invoice.invoiceStatus === "CONFIRMED" ? "Đã duyệt" : "Từ chối"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{invoice.notes || "Không có"}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={(e) => handleMenuOpen(e, invoice.id)}
                                    >
                                        Thao tác
                                    </Button>
                                    <Menu
                                        anchorEl={anchorEl}
                                        open={Boolean(anchorEl) && currentInvoiceId === invoice.id}
                                        onClose={handleMenuClose}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                handleMenuAction(invoice, "view");
                                            }}
                                        >
                                            Xem chi tiết
                                        </MenuItem>
                                        {invoice.invoiceStatus === "DRAFT" && (
                                            <>
                                                <MenuItem
                                                    onClick={() => {
                                                        handleMenuAction(invoice, "CONFIRMED");
                                                    }}
                                                >
                                                    Xác nhận
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() => {
                                                        handleMenuAction(invoice, "CANCELLED");
                                                    }}
                                                >
                                                    Từ chối
                                                </MenuItem>
                                            </>
                                        )}
                                    </Menu>
                                </>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceTable;