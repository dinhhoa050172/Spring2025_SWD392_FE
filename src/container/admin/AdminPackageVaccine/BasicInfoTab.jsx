import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import packageVaccineService from "@src/services/packageVaccineService.js";
import { message } from "@utils/message.js";
import { useState, useEffect } from "react";

const BasicInfoTab = ({ packageData, onUpdate }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const [discount, setDiscount] = useState(packageData?.discount || 0);

    useEffect(() => {
        if (packageData) {
            reset({
                vaccinePackageName: packageData.vaccinePackageName,
                description: packageData.description,
            });
            setDiscount(packageData.discount || 0);
        }
    }, [packageData, reset]);
    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const submitData = {
                id: packageData.vaccinePackageId,
                vaccinePackageName: data.vaccinePackageName,
                description: data.description,
                discount: parseFloat(discount),
            };
            const response = await packageVaccineService.updatePackageVaccineBasic(submitData);
            if (response) {
                toast.success(message.UPDATE_SUCCESS);
                onUpdate();
            }
        } catch (error) {
            console.error(message.UPDATE_ERROR, error);
            toast.error(message.UPDATE_ERROR);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div>
                <label className="block text-gray-700 font-medium">Tên gói vaccine</label>
                <input
                    type="text"
                    {...register("vaccinePackageName", { required: "Vui lòng nhập tên gói vaccine" })}
                    className="w-full p-2 border rounded-md outline-none"
                />
                {errors.vaccinePackageName && (
                    <p className="text-red-500">{errors.vaccinePackageName.message}</p>
                )}
            </div>

            <div>
                <label className="block text-gray-700 font-medium">Mô tả</label>
                <textarea
                    {...register("description", { required: "Vui lòng nhập mô tả" })}
                    className="w-full p-2 border rounded-md outline-none"
                />
                {errors.description && (
                    <p className="text-red-500">{errors.description.message}</p>
                )}
            </div>

            <div className="flex items-center space-x-4">
                <label className="text-gray-700 font-medium">Giảm giá (%):</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={discount}
                    onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-20 p-2 border rounded-md"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                disabled={isLoading}
            >
                {isLoading ? "Đang cập nhật..." : "Cập nhật thông tin"}
            </button>
        </form>
    );
};

export default BasicInfoTab;