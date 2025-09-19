import { formatDateTime, formatMoney } from "@utils/format.js";
import { FiX, FiFileText, FiTruck, FiCalendar, FiDollarSign, FiCheckCircle, FiEdit2, FiLayers } from "react-icons/fi";
import { FaVial, FaIndustry, FaGlobeAmericas } from "react-icons/fa";

const InvoiceDetailModal = ({ isOpen, onClose, invoice }) => {
    if (!isOpen || !invoice) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20">
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                {/* Modal content */}
                <div className="relative bg-white rounded-lg shadow-xl max-w-7xl w-full mx-auto p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <div className="flex items-center">
                            <FiFileText className="text-blue-600 text-2xl mr-3" />
                            <h2 className="text-2xl font-bold text-gray-800">Chi tiết yêu cầu nhập kho</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FiX className="text-2xl" />
                        </button>
                    </div>

                    {/* Invoice Details */}
                    <div className="mb-8 bg-gray-50 rounded-lg p-6">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <FiFileText className="mr-2 text-blue-500" />
                            Thông tin hóa đơn
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column */}
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FiTruck className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Nhà cung cấp</p>
                                        <p className="font-medium">{invoice.supplierName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FiEdit2 className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Người tạo</p>
                                        <p className="font-medium">{invoice.createdName}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FiCheckCircle className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Người xác nhận</p>
                                        <p className="font-medium">{invoice.confirmedName || "Chưa có"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <FiCalendar className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày tạo</p>
                                        <p className="font-medium">{formatDateTime(invoice.invoiceDate)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FiDollarSign className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng tiền</p>
                                        <p className="font-medium text-green-600">{formatMoney(invoice.totalAmount)} VND</p>
                                    </div>
                                </div>
                                <div className="flex items-start">
                                    <FiCalendar className="text-gray-500 mt-1 mr-3 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày xác nhận</p>
                                        <p className="font-medium">{formatDateTime(invoice.confirmedAt) || "Chưa có"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4 flex items-center">
                            <FiLayers className="mr-2 text-blue-500" />
                            Danh sách vaccine
                        </h3>
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaVial className="mr-2" />
                                                Tên Vaccine
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Số lượng</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Giá tiền</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tổng tiền</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FiCalendar className="mr-2" />
                                                Sản xuất
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FiCalendar className="mr-2" />
                                                Hết hạn
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaIndustry className="mr-2" />
                                                Nhà SX
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                            <div className="flex items-center">
                                                <FaGlobeAmericas className="mr-2" />
                                                Xuất xứ
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {invoice.lineItems.map((item, index) => (
                                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {item.vaccineName || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatMoney(item.quantity)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{formatMoney(item.unitPrice)} VND</td>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-green-600">
                                                {formatMoney(item.totalAmount)} VND
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.manufactureDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.expiryDate}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.manufacturer || "N/A"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{item.originCountry || "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end mt-6 border-t pt-4">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceDetailModal;