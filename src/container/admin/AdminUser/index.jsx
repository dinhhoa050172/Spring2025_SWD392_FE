import LoadingSpinner from "@components/Loading/LoadingSnipper.jsx";
import Pagination from "@components/Paging/index.jsx";
import adminService from "@src/services/adminService.js";
import { useEffect, useState } from "react";
import EditUserModal from "./EditUserAdmin.jsx";
import { userService } from "@src/services/userService.js";

const AdminUser = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const getAllUser = async () => {
        try {
            setIsLoading(true);
            const response = await adminService.getAllUser(page, size);
            const listUser = response.content.sort((a, b) =>
                a.fullname.localeCompare(b.fullname, 'vi', { sensitivity: 'base' })
            );
            setUsers(listUser);
            setTotalPages(response.totalPages);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        const backedPage = newPage - 1;
        setPage(backedPage);
    };

    const handleBanUser = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
        setDropdownOpen(null);
    };

    const confirmBanUser = async () => {
        setIsLoading(true);
        try {
            setLoadingBtn(true);
            await adminService.banUser(selectedUserId);
            setShowModal(false);
            getAllUser();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingBtn(false);
            setIsLoading(false);
        }
    };

    const handleUnbanUser = async (userId) => {
        try {
            setLoadingBtn(true);
            await adminService.unBanUser(userId);
            getAllUser();
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingBtn(false);
            setDropdownOpen(null);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setShowEditModal(true);
        setDropdownOpen(null);
    };

    const handleSaveUser = async (updatedUserData) => {
        try {
            await userService.editProfile(updatedUserData);
            getAllUser();
        } catch (error) {
            console.error(error);
        }
    };

    const toggleDropdown = (userId) => {
        setDropdownOpen(dropdownOpen === userId ? null : userId);
    };

    useEffect(() => {
        getAllUser();
    }, [page, size]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">User Management</h1>

            {/* Page Size Selector */}
            <div className="mb-6 flex items-center gap-2">
                <label className="text-gray-700 font-medium">Số mục mỗi trang:</label>
                <select
                    value={size}
                    onChange={(e) => {
                        setSize(Number(e.target.value));
                        setPage(0);
                    }}
                    className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {isLoading ? (
                <div className="text-center"><LoadingSpinner /></div>
            ) : (
                <div className="overflow-x-auto shadow-lg rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">STT</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Họ và tên</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Email</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Số điện thoại</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Giới tính</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Ngày sinh</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Chức năng</th>
                                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user, index) => (
                                <tr key={user.id} className="hover:bg-gray-200 transition-colors duration-200">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">{user.fullname}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">{user.phoneNumber}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                                        {user.gender === 'M' ? 'Nam' : 'Nữ'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                                        {new Date(user.birthday).toLocaleDateString()}
                                    </td>
                                    <td className={`px-6 py-2 whitespace-nowrap text-sm text-gray-600 ${user.deletedAt === null ? 'bg-green-300' : 'bg-red-300'}`}>
                                        {user.role}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm relative flex justify-center">
                                        <button
                                            onClick={() => toggleDropdown(user.id)}
                                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                                        >
                                            Thao tác
                                        </button>
                                        {dropdownOpen === user.id && (
                                            <div className="absolute right-0 mt-8 w-48 bg-gray-200 rounded-md shadow-3xl z-50">
                                                {user.deletedAt === null ? (
                                                    <button
                                                        onClick={() => handleBanUser(user.id)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-600 hover:text-white rounded-lg"
                                                        disabled={loadingBtn}
                                                    >
                                                        Khóa
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUnbanUser(user.id)}
                                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-600 hover:text-white rounded-lg"
                                                        disabled={loadingBtn}
                                                    >
                                                        Mở khóa
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => { handleEditUser(user);}}
                                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-pink-600 hover:text-white rounded-lg"
                                                    disabled={loadingBtn}
                                                >
                                                    Chỉnh sửa
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 0 && (
                <div className="mt-6 flex justify-center">
                    <Pagination
                        currentPage={page + 1}
                        totalPages={totalPages}
                        onPageChange={(newPage) => handlePageChange(newPage)}
                    />
                </div>
            )}

            {/* Ban Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Xác nhận cấm người dùng</h2>
                        <p className="mb-6 text-gray-600">Bạn có chắc chắn muốn cấm người dùng này không?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={confirmBanUser}
                                disabled={loadingBtn}
                                className={`${loadingBtn
                                    ? 'bg-red-300 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700'
                                    } text-white px-4 py-2 rounded-md transition-colors duration-200`}
                            >
                                {loadingBtn ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && (
                <EditUserModal
                    user={selectedUser}
                    onClose={() => setShowEditModal(false)}
                    onSave={handleSaveUser}
                />
            )}
        </div>
    );
};

export default AdminUser;