import { useState } from 'react';
import AppointmentTable from './AppointmentTable.jsx';

const CanceledSchedule = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Lịch hẹn quá hạn</h1>
            <div className="mb-6 flex items-center gap-2">
                <label className="text-gray-700 font-medium">Số mục mỗi trang:</label>
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
            <AppointmentTable
                currentPage={currentPage}
                pageSize={pageSize}
                onPageChange={handlePageChange}
            />
        </div>
    )
}

export default CanceledSchedule;