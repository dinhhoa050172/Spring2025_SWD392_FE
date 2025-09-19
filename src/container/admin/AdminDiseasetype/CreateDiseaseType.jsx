import { useState } from "react";
import { useForm } from "react-hook-form";
import diseaseTypeService from "@src/services/diseaseTypeService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";
import { IoClose } from "react-icons/io5";

const CreateDiseaseType = ({ onCreate, onClose }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [loadingBtn, setLoadingBtn] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    const onSubmit = async (data) => {
        setLoadingBtn(true);
        try {
            const newDisease = { name: data.name, description: data.description };
            const response = await diseaseTypeService.create(newDisease);
            if (response.code === "201") {
                setLoadingBtn(false);
                toast.success(message.SUCCESS_CREATE);
                onCreate();
                reset();
                setIsOpen(false);
            } else {
                toast.error(message.ERROR_CREATE);
            }
        } catch (error) {
            console.error(message.ERROR_CREATE, error);
            toast.error(message.ERROR_CREATE);
        }
    };

    const handleOpenModal = () => setIsOpen(true);
    const handleCloseModal = () => {
        setIsOpen(false);
        if (onClose) onClose();
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-indigo-700 mb-6"
            >
                Thêm loại bệnh mới
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl h-2/3">

                        <div className="relative">
                            <h2 className="text-xl font-semibold mb-4">Thêm loại bệnh mới</h2>
                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                            >
                                <IoClose size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tên loại bệnh
                                </label>
                                <input
                                    {...register("name", { required: "Tên loại bệnh là bắt buộc" })}
                                    className={`mt-1 outline-none block w-full rounded-md border border-gray-400 shadow-sm p-2
                                         focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? "border-red-500" : ""
                                        }`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Mô tả
                                </label>
                                <textarea
                                    {...register("description")}
                                    className="mt-1 block w-full rounded-md border outline-none border-gray-300 shadow-sm
                                     focus:border-indigo-500 focus:ring-indigo-500 p-2 h-[17rem]"
                                    rows="3"
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                    disabled={loadingBtn}
                                >
                                    {loadingBtn ? "Đang tạo..." : "Thêm loại bệnh"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default CreateDiseaseType;