// src/components/ServiceList/Pagination.jsx
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center items-center gap-4 mt-6">
            <button
                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
                Trước
            </button>

            <span className="text-gray-700 font-medium">
                {currentPage} / {totalPages}
            </span>

            <button
                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage >= totalPages}
                className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            >
                Sau
            </button>
        </div>
    );
};

export default Pagination;