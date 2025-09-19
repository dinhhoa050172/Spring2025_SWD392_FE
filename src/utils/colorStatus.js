// Hàm ánh xạ trạng thái với màu sắc Tailwind
const getStatusColor = (status) => {
    switch (status?.toUpperCase()) { // Chuyển thành chữ hoa để đồng bộ
        case "PENDING":
            return "bg-yellow-100 text-yellow-800"; // Vàng nhạt
        case "BANKED":
            return "bg-blue-100 text-blue-800"; // Xanh dương nhạt
        case "CHECKED_IN":
            return "bg-purple-100 text-purple-800"; // Tím nhạt
        case "COMPLETE":
            return "bg-green-100 text-green-800"; // Xanh lá nhạt
        case "CANCEL":
            return "bg-red-100 text-red-800"; // Đỏ nhạt
        case "PROCESSING":
            return "bg-orange-100 text-orange-800"; // Cam nhạt
        case "PAID_BY_CASH":
            return "bg-blue-100 text-blue-800"; // Xanh dương nhạt
        default:
            return "bg-gray-100 text-gray-800"; // Mặc định nếu không khớp
    }
};
export default getStatusColor;