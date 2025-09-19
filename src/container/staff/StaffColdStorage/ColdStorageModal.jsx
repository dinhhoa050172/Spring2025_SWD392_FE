import React, { useState, useEffect } from 'react';
import { 
  FiX, FiThermometer, FiCalendar, FiMapPin, FiBox, 
  FiDatabase, FiPackage, FiCheckCircle, FiAlertCircle 
} from 'react-icons/fi';
import { FaIndustry, FaTemperatureLow, FaTemperatureHigh } from 'react-icons/fa';
import { formatDate } from '@utils/format.js';
import coldStorageService from '@src/services/coldStorageService.js';
import { CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { message } from '@utils/message.js';

const ColdStorageModal = ({ isOpen, onClose, storage }) => {
    const [vaccines, setVaccines] = useState([]);
    const [loadingVaccines, setLoadingVaccines] = useState(false);

    useEffect(() => {
        if (isOpen && storage) {
            fetchVaccinesInStorage();
        }
    }, [isOpen, storage]);

    const fetchVaccinesInStorage = async () => {
        try {
            setLoadingVaccines(true);
            const response = await coldStorageService.getVaccineFromColdStorage(storage.id);
            setVaccines(response || []);
        } catch (error) {
            console.error(message.ERROR_FETCH_DATA, error);
            setVaccines([]);
        } finally {
            setLoadingVaccines(false);
        }
    };

    if (!isOpen || !storage) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
                    <div className="flex items-center">
                        <FiThermometer className="text-blue-600 text-2xl mr-3" />
                        <h2 className="text-2xl font-bold text-gray-800">Chi Tiết Kho Lạnh: {storage.coldStorageName}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Basic Information */}
                        <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center text-blue-700">
                                <FiBox className="mr-2" />
                                Thông tin cơ bản
                            </h3>
                            <div className="space-y-3">
                                <InfoRow icon={<FiBox />} label="Tên Kho" value={storage.coldStorageName} />
                                <InfoRow icon={<FaIndustry />} label="Nhà Sản Xuất" value={storage.manufacturer} />
                                <InfoRow icon={<FiPackage />} label="Loại" value={storage.type} />
                                <InfoRow icon={<FiMapPin />} label="Vị Trí" value={storage.locationHierarchy} />
                            </div>
                        </div>

                        {/* Status Information */}
                        <div className="bg-green-50 rounded-lg p-6 border border-green-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center text-green-700">
                                <FiCheckCircle className="mr-2" />
                                Trạng thái hoạt động
                            </h3>
                            <div className="space-y-3">
                                <InfoRow icon={<FiCalendar />} label="Ngày Hoạt Động" value={formatDate(storage.effectiveFrom)} />
                                <InfoRow icon={<FiCalendar />} label="Ngày Mua" value={formatDate(storage.purchaseDate)} />
                                <div className="flex items-center">
                                    <div className="bg-green-100 p-2 rounded-full mr-3">
                                        {storage.isActive ? (
                                            <FiCheckCircle className="text-green-600" />
                                        ) : (
                                            <FiAlertCircle className="text-red-600" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Trạng Thái</p>
                                        <p className={`font-medium ${storage.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                            {storage.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Temperature Information */}
                        <div className="bg-purple-50 rounded-lg p-6 border border-purple-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-700">
                                <FiThermometer className="mr-2" />
                                Thông số nhiệt độ
                            </h3>
                            <div className="space-y-3">
                                <InfoRow 
                                    icon={<FiThermometer />} 
                                    label="Đơn Vị Nhiệt Độ" 
                                    value={storage.temperatureScale === 'C' ? 'Độ C (C)' : 'Độ F (F)'} 
                                />
                                <InfoRow 
                                    icon={<FiThermometer />} 
                                    label="Nhiệt Độ Hiện Tại" 
                                    value={`${storage.currentTemperature}°${storage.temperatureScale}`} 
                                />
                                <InfoRow 
                                    icon={<FaTemperatureLow />} 
                                    label="Ngưỡng Nhiệt Độ Thấp Nhất" 
                                    value={`${storage.minTemperatureThreshold}°${storage.temperatureScale}`} 
                                />
                                <InfoRow 
                                    icon={<FaTemperatureHigh />} 
                                    label="Ngưỡng Nhiệt Độ Cao Nhất" 
                                    value={`${storage.maxTemperatureThreshold}°${storage.temperatureScale}`} 
                                />
                            </div>
                        </div>

                        {/* Capacity Information */}
                        <div className="bg-amber-50 rounded-lg p-6 border border-amber-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center text-amber-700">
                                <FiDatabase className="mr-2" />
                                Thông tin lưu trữ
                            </h3>
                            <div className="space-y-3">
                                <InfoRow icon={<FiDatabase />} label="Sức Chứa" value={storage.storageCapacity} />
                                <InfoRow icon={<FiPackage />} label="Số Lọ Hiện Có" value={storage.currentVialCount} />
                                <InfoRow 
                                    icon={<FiPackage />} 
                                    label="Chỗ Trống" 
                                    value={storage.storageCapacity - storage.currentVialCount} 
                                    highlight={storage.storageCapacity - storage.currentVialCount < 10}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Vaccine Table */}
                    <div className="mt-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold flex items-center text-gray-800">
                                <FiPackage className="mr-2 text-blue-500" />
                                Danh sách Vaccine trong kho
                            </h3>
                            <Typography variant="body2" className="text-gray-500">
                                Tổng số: {vaccines.length} vaccine
                            </Typography>
                        </div>
                        
                        {loadingVaccines ? (
                            <div className="flex justify-center py-8">
                                <CircularProgress />
                            </div>
                        ) : (
                            <TableContainer component={Paper} className="shadow-sm">
                                <Table className="min-w-full">
                                    <TableHead className="bg-gray-100">
                                        <TableRow>
                                            <TableCell className="font-semibold">STT</TableCell>
                                            <TableCell className="font-semibold">Số lô</TableCell>
                                            <TableCell className="font-semibold">Tên vaccine</TableCell>
                                            <TableCell className="font-semibold">Ngày SX/HSD</TableCell>
                                            <TableCell className="font-semibold">Số lượng</TableCell>
                                            <TableCell className="font-semibold">Ghi chú</TableCell>
                                            <TableCell className="font-semibold">Trạng thái</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {vaccines.length > 0 ? (
                                            vaccines.map((vaccine, index) => (
                                                <TableRow 
                                                    key={vaccine.id} 
                                                    className="hover:bg-gray-50"
                                                >
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell className="font-medium">
                                                        {vaccine.batchNumber}
                                                    </TableCell>
                                                    <TableCell>{vaccine.vaccineName}</TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm">NSX: {formatDate(vaccine.manufactureDate)}</span>
                                                            <span className="text-sm">HSD: {formatDate(vaccine.expiryDate)}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span>Ban đầu: {vaccine.initialQuantity}</span>
                                                            <span className="font-medium">Hiện tại: {vaccine.currentQuantity}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{vaccine.note || "Không" }</TableCell>
                                                    <TableCell>
                                                        <StatusBadge status={vaccine.status} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" className="py-8 text-gray-500">
                                                    Không có vaccine nào trong kho này
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

// Component phụ cho các dòng thông tin
const InfoRow = ({ icon, label, value, highlight = false }) => (
    <div className="flex items-start">
        <div className="bg-white p-2 rounded-full mr-3 shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`font-medium ${highlight ? 'text-red-600' : ''}`}>
                {value}
            </p>
        </div>
    </div>
);

// Component phụ cho hiển thị trạng thái
const StatusBadge = ({ status }) => {
    let bgColor = '';
    let textColor = '';
    let text = '';
    
    switch(status) {
        case 'AVAILABLE':
            bgColor = 'bg-green-100';
            textColor = 'text-green-800';
            text = 'Sẵn sàng';
            break;
        case 'SOLD_OUT':
            bgColor = 'bg-red-100';
            textColor = 'text-red-800';
            text = 'Hết hàng';
            break;
        default:
            bgColor = 'bg-yellow-100';
            textColor = 'text-yellow-800';
            text = 'Tạm ngưng';
    }
    
    return (
        <span className={`px-3 py-1 rounded-full text-sm ${bgColor} ${textColor}`}>
            {text}
        </span>
    );
};

export default ColdStorageModal;