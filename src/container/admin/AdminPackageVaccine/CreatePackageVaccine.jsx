import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import packageVaccineService from "@src/services/packageVaccineService.js";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { formatMoney } from "@utils/format.js";
import { message } from "@utils/message.js";
import vaccineService from "@src/services/vaccineService.js";

const CreatePackageVaccine = ({ onClose, open }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: {
            vaccinePackageName: "",
            description: "",
            vaccines: []
        },
    });

    const [availableVaccines, setAvailableVaccines] = useState([]);
    const [selectedVaccines, setSelectedVaccines] = useState([]);
    const [currentid, setCurrentid] = useState("");
    const [doseQuantity, setDoseQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const fetchVaccines = async () => {
        try {
            const response = await vaccineService.getAllVaccine();
            if (response) {
                setAvailableVaccines(response);
            }
        } catch (error) {
            console.error(message.ERROR_FETCH_DATA, error);
        }
    };

    useEffect(() => {
        if (open) {
            fetchVaccines();
            setSelectedVaccines([]);
            setCurrentid("");
            setDoseQuantity(1);
            setDiscount(0);
        }
    }, [open]);

    const handleAddVaccine = () => {
        if (currentid) {
            const selectedVaccine = availableVaccines.find(v => v.id === currentid);
            console.log(availableVaccines)
            if (selectedVaccine && doseQuantity > 0) {
                const vaccineWithDoseQuantity = {
                    id: selectedVaccine.id,
                    vaccineName: selectedVaccine.vaccineName,
                    doseQuantity: parseInt(doseQuantity),
                    pricePerDose: selectedVaccine.pricePerDose || 0
                };
                setSelectedVaccines([...selectedVaccines, vaccineWithDoseQuantity]);
                setAvailableVaccines(availableVaccines.filter(v => v.id !== selectedVaccine.id));
                setCurrentid("");
                setDoseQuantity(1);
            }
        }
    };

    const handleRemoveVaccine = (id) => {
        const removedVaccine = selectedVaccines.find(v => v.id === id);
        setSelectedVaccines(selectedVaccines.filter(v => v.id !== id));
        setAvailableVaccines([...availableVaccines, {
            id: removedVaccine.id,
            vaccineName: removedVaccine.vaccineName,
            pricePerDose: removedVaccine.pricePerDose
        }]);
    };

    const calculateTotalPrice = () => {
        return selectedVaccines.reduce((total, vaccine) => {
            return total + (vaccine.pricePerDose * vaccine.doseQuantity);
        }, 0);
    };

    const calculateDiscountedPrice = () => {
        const total = calculateTotalPrice();
        const discountAmount = total * (discount / 100);
        return total - discountAmount;
    };

    const onSubmit = async (data) => {
        if (selectedVaccines.length === 0) {
            toast.error(message.SELECT_VACCINE);
            return;
        }

        const submitData = {
            ...data,
            vaccines: selectedVaccines.map(v => ({
                id: v.id,
                doseQuantity: v.doseQuantity
            })),
            totalPrice: calculateDiscountedPrice(),
            discount: parseFloat(discount)
        };
        try {
            const response = await packageVaccineService.createPackageVaccine(submitData);
            if (response) {
                toast.success(message.SUCCESS_CREATE);
                reset();
                setSelectedVaccines([]);
                setDiscount(0);
                onClose();
            }
        } catch (error) {
            console.error(message.ERROR_CREATE, error);
            toast.error(message.ERROR_CREATE);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-semibold">Tạo Gói Vaccine</h2>
                <button>
                    <IoClose size={30} onClick={onClose} />
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-medium">Tên gói vaccine</label>
                    <input
                        type="text"
                        {...register("vaccinePackageName", { required: "Vui lòng nhập tên gói vaccine" })}
                        className="w-full p-2 border rounded-md outline-none"
                    />
                    {errors.vaccinePackageName && <p className="text-red-500">{errors.vaccinePackageName.message}</p>}
                </div>

                <div>
                    <label className="block text-gray-700 font-medium">Mô tả</label>
                    <textarea
                        {...register("description", { required: "Vui lòng nhập mô tả" })}
                        className="w-full p-2 border rounded-md outline-none"
                    />
                    {errors.description && <p className="text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-2">
                    <label className="block text-black font-medium">Chọn vaccine</label>
                    <div className="flex space-x-4 items-end">
                        <div className="flex-1">
                            <select
                                value={currentid}
                                onChange={(e) => setCurrentid(e.target.value)}
                                className="w-full p-2 border rounded-md outline-none max-h-20 overflow-y-scroll"
                            >
                                <option value="">Chọn vaccine</option>
                                {availableVaccines.map((vaccine) => (
                                    <option key={vaccine.id} value={vaccine.id}>
                                        {vaccine.vaccineName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="w-24">
                            <label className="block text-gray-700">Số liều</label>
                            <input
                                type="number"
                                min="1"
                                value={doseQuantity}
                                onChange={(e) => setDoseQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={handleAddVaccine}
                            className="bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600"
                            disabled={!currentid}
                        >
                            Thêm
                        </button>
                    </div>

                    {selectedVaccines.length > 0 ? (
                        <div className="mt-2 max-h-56 overflow-y-auto">
                            <table className="w-full bg-gray-50 border border-gray-300 rounded-lg">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="p-2 text-left text-gray-700 font-medium">Tên Vaccine</th>
                                        <th className="p-2 text-left text-gray-700 font-medium">Liều</th>
                                        <th className="p-2 text-left text-gray-700 font-medium">Giá (VND)</th>
                                        <th className="p-2 text-left text-gray-700 font-medium">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedVaccines.map((vaccine) => (
                                        <tr key={vaccine.id} className="border-t">
                                            <td className="p-2">{vaccine.vaccineName}</td>
                                            <td className="p-2">{vaccine.doseQuantity}</td>
                                            <td className="p-2">{formatMoney(vaccine.pricePerDose * vaccine.doseQuantity)}</td>
                                            <td className="p-2 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveVaccine(vaccine.id)}
                                                    className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-gray-500 mt-2">Chưa có vaccine nào được chọn</p>
                    )}

                    {selectedVaccines.length > 0 && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-700 font-medium">Tổng tiền (trước giảm giá):</span>
                                <span>{formatMoney(calculateTotalPrice())} VND</span>
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
                            <div className="flex justify-between">
                                <span className="text-gray-700 font-medium">Tổng tiền (sau giảm giá):</span>
                                <span className="text-green-600 font-semibold">{formatMoney(calculateDiscountedPrice())} VND</span>
                            </div>
                        </div>
                    )}
                </div>

                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600" disabled={isLoading}>
                    {isLoading ? "Tạo gói vaccine..." : "Tạo Gói Vaccine"}
                </button>
            </form>
        </div>
    );
};

export default CreatePackageVaccine;