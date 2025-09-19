import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import diseaseTypeService from "@src/services/diseaseTypeService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

const EditDiseaseType = ({ disease, onUpdate, onCancel }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            name: disease.name || "",
            description: disease.description || "",
        },
    });
    const [loadingBtn, setLoadingBtn] = useState(false);

    useEffect(() => {
        reset({
            name: disease.name || "",
            description: disease.description || "",
        });
    }, [disease, reset]);

    const onSubmit = async (data) => {
        setLoadingBtn(true);
        try {
            const updatedDisease = { ...disease, name: data.name, description: data.description };
            const response = await diseaseTypeService.update(updatedDisease);
            if (response.code === "200") {
                onUpdate();
                setLoadingBtn(false);
                toast.success(message.UPDATE_SUCCESS);
                onCancel();
            } else {
                toast.error(message.UPDATE_ERROR);
            }
        } catch (error) {
            console.error(message.UPDATE_ERROR, error);
            toast.error(message.UPDATE_ERROR);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl h-2/3">
                <h2 className="text-xl font-semibold mb-4">Sửa loại bệnh</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tên loại bệnh
                        </label>
                        <input
                            {...register("name", { required: "Tên loại bệnh là bắt buộc" })}
                            className={`mt-1 block w-full outline-none border p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 ${errors.name ? "border-red-500" : ""
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
                            className="mt-1 h-[17rem] block w-full rounded-md outline-none border p-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows="3"
                        />
                    </div>
                    <div className="flex space-x-2">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            disabled={loadingBtn}
                        >
                            {loadingBtn ? "Đang sửa..." : "Sửa"}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                        >
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditDiseaseType;