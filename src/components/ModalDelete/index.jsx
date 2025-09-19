const ConfirmDeleteModal = ({ isOpen, onConfirm, onCancel, message, loadingBtn }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                <h3 className="text-lg font-semibold mb-4">Xác nhận xóa</h3>
                <p className="text-sm text-gray-600 mb-6">{message}</p>
                <div className="flex justify-end space-x-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={loadingBtn}
                    >
                        {loadingBtn ? "Đang xóa" : "Xóa"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;