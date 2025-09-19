import { useState, useEffect } from 'react'; // Thêm useEffect
import AppointmentTable from './AppointmentTable.jsx';
import { useForm } from 'react-hook-form';
import { IoClose } from 'react-icons/io5';

const ScheduleStaff = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [size, setSize] = useState(10);
    const [selectedStatus, setSelectedStatus] = useState("PENDING");
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            phoneNumber: '',
        },
    });

    // Tự động điền ngày hiện tại khi component mount
    useEffect(() => {
        const formattedDate = new Date().toLocaleDateString('en-CA');
        setSelectedDate(formattedDate);
    }, []);

    const handlePageChange = (newPage) => {
        const backendPage = newPage - 1;
        setCurrentPage(backendPage);
    };

    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        setCurrentPage(0);
    };

    const onSubmit = (data) => {
        setPhoneNumber(data.phoneNumber);
        setCurrentPage(0);
    };

    const handleClear = () => {
        setPhoneNumber('');
        reset({ phoneNumber: '' });
        setCurrentPage(0);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
        setCurrentPage(0);
    };

    return (
        <div className="m-6">
            <h1 className="text-2xl font-bold mb-4">Lịch hẹn khách hàng</h1>

            {/* Bộ lọc */}
            <div className="mb-4 flex flex-wrap gap-4 justify-end items-end">

                {/* Nút chọn trạng thái */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${selectedStatus === "PENDING"
                            ? "bg-yellow-100 text-yellow-800 border-b-2 border-yellow-500"
                            : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-800"
                            }`}
                        onClick={() => handleStatusChange("PENDING")}
                    >
                        Thanh toán tại quầy
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${selectedStatus === "PAID_BY_CASH"
                            ? "bg-green-100 text-green-800 border-b-2 border-green-500"
                            : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                            }`}
                        onClick={() => handleStatusChange("PAID_BY_CASH")}
                    >
                        Đã thanh toán tại quầy
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${selectedStatus === "BANKED"
                            ? "bg-blue-100 text-blue-800 border-b-2 border-blue-500"
                            : "text-gray-600 hover:bg-blue-50 hover:text-blue-800"
                            }`}
                        onClick={() => handleStatusChange("BANKED")}
                    >
                        Sẵn sàng tiêm
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${selectedStatus === "CHECKED_IN"
                            ? "bg-purple-100 text-purple-800 border-b-2 border-purple-500"
                            : "text-gray-600 hover:bg-purple-50 hover:text-purple-800"
                            }`}
                        onClick={() => handleStatusChange("CHECKED_IN")}
                    >
                        Kiểm tra sau tiêm
                    </button>
                </div>

                <div className='flex gap-5'>
                    {/* Tìm kiếm theo ngày */}
                    <div className="flex flex-col gap-2">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="border rounded-md p-2"
                        />
                    </div>

                    {/* Tìm kiếm theo số điện thoại */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-4">
                        <div className="relative rounded-md p-2 border border-gray-300 bg-white min-w-64 flex items-center">
                            <input
                                type="text"
                                className="border-none outline-none w-full"
                                placeholder="Nhập số điện thoại khách hàng"
                                {...register('phoneNumber', {
                                    pattern: {
                                        value: /^[0-9]+$/,
                                        message: "Số điện thoại chỉ được chứa số",
                                    },
                                })}
                            />
                            {phoneNumber && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <IoClose />
                                </button>
                            )}
                        </div>
                        {errors.phoneNumber && (
                            <p className="text-red-500 text-sm absolute mt-10">{errors.phoneNumber.message}</p>
                        )}
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-700"
                        >
                            Tìm kiếm
                        </button>
                    </form>
                </div>

            </div>

            {/* Page Size Selector */}
            <div className="mb-4">
                <label className="mr-2">Số mục mỗi trang:</label>
                <select
                    value={size}
                    onChange={(e) => {
                        setSize(Number(e.target.value));
                        setCurrentPage(0);
                    }}
                    className="border rounded-md p-1"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            <AppointmentTable
                selectedStatus={selectedStatus}
                phoneNumber={phoneNumber}
                selectedDate={selectedDate}
                currentPage={currentPage}
                size={size}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ScheduleStaff;