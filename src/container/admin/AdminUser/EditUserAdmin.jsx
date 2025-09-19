import { useEffect } from "react";
import { useForm } from "react-hook-form";

const EditUserModal = ({ user, onClose, onSave }) => {
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
        defaultValues: {
            fullname: "",
            email: "",
            phoneNumber: "",
            gender: "M",
            birthday: "",
            role: "CUSTOMER",
        },
    });

    useEffect(() => {
        if (user) {
            reset({
                fullname: user.fullname || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                gender: user.gender || "M",
                birthday: user.birthday ? user.birthday.split("T")[0] : "",
                role: user.role || "CUSTOMER",
            });
        }
    }, [user, reset]);

    const onSubmit = async (data) => {
        try {
            await onSave({ id: user.id, role: data.role });
            onClose();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Chỉnh sửa người dùng</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Họ và tên</label>
                        <input
                            {...register("fullname")}
                            disabled
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input
                            {...register("email")}
                            disabled
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Số điện thoại</label>
                        <input
                            {...register("phoneNumber")}
                            disabled
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Giới tính</label>
                        <select
                            {...register("gender")}
                            disabled
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        >
                            <option value="M">Nam</option>
                            <option value="F">Nữ</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-1">Ngày sinh</label>
                        <input
                            type="date"
                            {...register("birthday")}
                            disabled
                            className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 font-medium mb-1">Chức năng</label>
                        <select
                            {...register("role")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="CUSTOMER">Customer</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`${isSubmitting
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                                } text-white px-4 py-2 rounded-md transition-colors duration-200`}
                        >
                            {isSubmitting ? 'Đang lưu...' : 'Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;