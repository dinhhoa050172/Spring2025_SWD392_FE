import { Modal } from "@mui/material";
import { 
  FiX, FiCalendar, FiBox, FiDatabase, 
  FiCheckCircle, FiAlertTriangle, FiClock,
  FiArchive, FiInfo, FiEdit2
} from "react-icons/fi";
import { FaVial, FaWarehouse, FaRegCalendarCheck } from "react-icons/fa";
import { GiMedicinePills } from "react-icons/gi";
import { formatDate, formatDateTime } from "@utils/format.js";

const VaccineBatchDetailModal = ({ open, onClose, batch }) => {
    if (!batch) return null;

    const getStatusIcon = (status) => {
        switch (status) {
            case "AVAILABLE":
                return <FiCheckCircle className="text-green-500 mr-2" />;
            case "SOLD OUT":
                return <FiAlertTriangle className="text-red-500 mr-2" />;
            case "UNAVAILABLE":
                return <FiClock className="text-amber-500 mr-2" />;
            default:
                return <FiInfo className="text-gray-500 mr-2" />;
        }
    };

    const getExpiryIcon = (status) => {
        return status === "VALID" 
            ? <FaRegCalendarCheck className="text-green-500 mr-2" /> 
            : <FiAlertTriangle className="text-red-500 mr-2" />;
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center">
                        <GiMedicinePills className="text-white text-2xl mr-3" />
                        <h2 className="text-xl font-bold text-white">
                            Chi tiết lô vaccine
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-blue-200 transition-colors"
                    >
                        <FiX size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Column */}
                        <div className="space-y-4">
                            <DetailItem 
                                icon={<FaVial className="text-blue-500" />}
                                label="Tên Vaccine" 
                                value={batch.vaccineName} 
                            />
                            <DetailItem 
                                icon={<FiBox className="text-blue-500" />}
                                label="Số Lô" 
                                value={batch.batchNumber} 
                            />
                            <DetailItem 
                                icon={<FaWarehouse className="text-blue-500" />}
                                label="Kho Chứa" 
                                value={batch.coldStorageId || "Chưa thêm vào kho"} 
                            />
                            <DetailItem 
                                icon={<FiCalendar className="text-blue-500" />}
                                label="Ngày Sản Xuất" 
                                value={formatDate(batch.manufactureDate)} 
                            />
                        </div>

                        {/* Right Column */}
                        <div className="space-y-4">
                            <DetailItem 
                                icon={<FiCalendar className="text-blue-500" />}
                                label="Ngày Hết Hạn" 
                                value={formatDate(batch.expiryDate)} 
                            />
                            <DetailItem 
                                icon={<FiDatabase className="text-blue-500" />}
                                label="Số Lượng Ban Đầu" 
                                value={batch.initialQuantity} 
                            />
                            <DetailItem 
                                icon={<FiDatabase className="text-blue-500" />}
                                label="Số Lượng Hiện Tại" 
                                value={batch.currentQuantity} 
                            />
                            <DetailItem 
                                icon={getStatusIcon(batch.status)}
                                label="Trạng Thái" 
                                value={
                                    batch.status === "AVAILABLE" ? "Sẵn sàng" :
                                    batch.status === "SOLD OUT" ? "Hết Vaccine" : "Tạm ngưng"
                                }
                                valueClassName={
                                    batch.status === "AVAILABLE" ? "text-green-600" :
                                    batch.status === "SOLD OUT" ? "text-red-600" : "text-amber-600"
                                }
                            />
                            <DetailItem 
                                icon={getExpiryIcon(batch.statusOfExpiry)}
                                label="Trạng Thái HSD" 
                                value={batch.statusOfExpiry === "VALID" ? "Còn hạn" : "Hết hạn"}
                                valueClassName={batch.statusOfExpiry === "VALID" ? "text-green-600" : "text-red-600"}
                            />
                        </div>
                    </div>

                    {/* Bottom Section */}
                    <div className="space-y-4">
                        <DetailItem 
                            icon={<FiClock className="text-blue-500" />}
                            label="Ngày Nhận" 
                            value={formatDateTime(batch.receivedAt)} 
                        />
                        <DetailItem 
                            icon={<FiEdit2 className="text-blue-500" />}
                            label="Ghi Chú" 
                            value={batch.notes || "Không có"} 
                            className="italic text-gray-500"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </Modal>
    );
};

const DetailItem = ({ icon, label, value, className, valueClassName = "text-gray-800" }) => (
    <div className={`flex items-start ${className}`}>
        <div className="mr-3 mt-1">
            {icon}
        </div>
        <div className="flex-1">
            <div className="flex justify-between">
                <span className="font-medium text-gray-600">{label}:</span>
                <span className={`${valueClassName} text-right`}>{value}</span>
            </div>
        </div>
    </div>
);

export default VaccineBatchDetailModal;