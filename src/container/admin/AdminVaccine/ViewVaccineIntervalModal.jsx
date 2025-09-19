import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import vaccineService from '@src/services/vaccineService.js';
import { toast } from 'react-toastify';

const ViewVaccineIntervalModal = ({ open, onClose, vaccineId }) => {
    const [intervals, setIntervals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Lấy dữ liệu intervals từ API
    useEffect(() => {
        const fetchIntervals = async () => {
            if (!open || !vaccineId) return;
            setIsLoading(true);
            try {
                const response = await vaccineService.getAllTemplateDoseIntervalByVaccineId(vaccineId);
                console.log(response)
                if (response.code === '200') {
                    setIntervals(response.data);
                } else {
                    toast.error('Không có dữ liệu khoảng cách vaccine!');
                    setIntervals([]);
                }
            } catch (error) {
                console.error('Error fetching vaccine intervals:', error);
                toast.error('Không thể tải dữ liệu khoảng cách vaccine!');
                setIntervals([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchIntervals();
    }, [open, vaccineId]);

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center ${open ? 'block' : 'hidden'
                }`}
        >
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">Chi tiết khoảng cách vaccine</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <FiX className="text-2xl" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="text-center">
                            <span className="text-gray-600 text-lg">Đang tải dữ liệu...</span>
                        </div>
                    ) : intervals.length > 0 ? (
                        <div className="space-y-6">
                            {intervals.map((interval, index) => (
                                <div
                                    key={interval.id}
                                    className="p-4 border border-gray-200 rounded-lg bg-gray-50 shadow-sm"
                                >
                                    <h3 className="text-lg font-semibold text-gray-700 mb-3">
                                        Mũi {interval.fromDoseNumber + 1}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Đơn vị kiểm tra */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Đơn vị kiểm tra
                                            </label>
                                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800">
                                                {interval.validateBy === 'MONTHS' ? 'Tháng' : 'Năm'}
                                            </p>
                                        </div>

                                        {/* Tuổi tối thiểu */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tuổi tối thiểu ({interval.validateBy === 'MONTHS' ? 'Tháng' : 'Năm'})
                                            </label>
                                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800">
                                                {interval.validateBy === 'MONTHS'
                                                    ? interval.minAgeApplicableMonth
                                                    : interval.minAgeApplicableYear}
                                            </p>
                                        </div>

                                        {/* Khoảng cách ngày */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Khoảng cách ngày
                                            </label>
                                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800">
                                                {interval.daysBetween}
                                            </p>
                                        </div>

                                        {/* Thông tin mũi */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Khoảng cách mũi
                                            </label>
                                            <p className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-800">
                                                {interval.fromDoseNumber + 1} - {interval.toDoseNumber + 1}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
                                >
                                    <FiX className="mr-2" /> Đóng
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <span className="text-red-600 font-bold text-lg">
                                Không có khoảng cách vaccine để hiển thị
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewVaccineIntervalModal;