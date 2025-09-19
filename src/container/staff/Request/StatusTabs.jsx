const StatusTabs = ({ selectedStatus, handleStatusTabChange }) => {
  return (
    <div className="mb-4 flex border-b border-gray-200 justify-end">
      <button
        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${
          selectedStatus === "PENDING"
            ? "bg-yellow-100 text-yellow-800 border-b-2 border-yellow-500"
            : "text-gray-600 hover:bg-yellow-50 hover:text-yellow-800"
        }`}
        onClick={() => handleStatusTabChange("PENDING")}
      >
        Đang chờ
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${
          selectedStatus === "APPROVED"
            ? "bg-green-100 text-green-800 border-b-2 border-green-500"
            : "text-gray-600 hover:bg-green-50 hover:text-green-800"
        }`}
        onClick={() => handleStatusTabChange("APPROVED")}
      >
        Đã chấp nhận
      </button>
      <button
        className={`px-4 py-2 text-sm font-medium rounded-t-md focus:outline-none ${
          selectedStatus === "REJECTED"
            ? "bg-red-100 text-red-800 border-b-2 border-red-500"
            : "text-gray-600 hover:bg-red-50 hover:text-red-800"
        }`}
        onClick={() => handleStatusTabChange("REJECTED")}
      >
        Đã từ chối
      </button>
    </div>
  );
};

export default StatusTabs;