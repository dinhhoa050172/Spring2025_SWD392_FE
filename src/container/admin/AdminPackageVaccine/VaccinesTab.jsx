import { useEffect, useState } from "react";
import packageVaccineService from "@src/services/packageVaccineService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

const VaccinesTab = ({
    packageId,
    availableVaccines,
    setAvailableVaccines,
    onUpdate,
}) => {
    const [currentVaccineId, setCurrentVaccineId] = useState("");
    const [doseQuantity, setDoseQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedVaccines, setSelectedVaccines] = useState([]);

    const getPackageVaccineDetail = async () => {
        try {
            const response = await packageVaccineService.getPackageVaccineById(packageId);
            setSelectedVaccines(response.data.vaccines);
        } catch (error) {
            console.error(message.ERROR_FETCH_DATA, error)
        }
    }

    useEffect(() => {
        getPackageVaccineDetail();
    }, [packageId]);
    const handleAddVaccine = () => {
        if (currentVaccineId) {
            const selectedVaccine = availableVaccines.find(v => v.vaccineId === currentVaccineId);
            if (selectedVaccine && doseQuantity > 0) {
                const vaccineWithDose = {
                    vaccineId: selectedVaccine.vaccineId,
                    vaccineName: selectedVaccine.vaccineName,
                    doseQuantity: parseInt(doseQuantity),
                    pricePerDose: selectedVaccine.pricePerDose || 0,
                };
                setSelectedVaccines([...selectedVaccines, vaccineWithDose]);
                setAvailableVaccines(availableVaccines.filter(v => v.vaccineId !== selectedVaccine.vaccineId));
                setCurrentVaccineId("");
                setDoseQuantity(1);
            }
        }
    };

    const handleRemoveVaccine = (vaccineId) => {
        const removedVaccine = selectedVaccines.find(v => v.vaccineId === vaccineId);
        setSelectedVaccines(selectedVaccines.filter(v => v.vaccineId !== vaccineId));
        setAvailableVaccines([...availableVaccines, {
            vaccineId: removedVaccine.vaccineId,
            vaccineName: removedVaccine.vaccineName,
            pricePerDose: removedVaccine.pricePerDose,
        }]);
    };

    const onSubmitVaccines = async () => {
        if (selectedVaccines.length === 0) {
            toast.error(message.SELECT_VACCINE);
            return;
        }
        setIsLoading(true);
        try {
            const submitData = {
                vaccines: selectedVaccines.map((vaccine) => {
                    return {
                        // id: packageId,
                        vaccineId: vaccine.vaccineId,
                        doseQuantity: vaccine.doseQuantity
                    }
                })
            }
            const response = await packageVaccineService.updateVaccineInPackageVaccine(packageId, submitData.vaccines);
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
        <div className="space-y-4 mt-4">
            <div className="flex space-x-4 items-end">
                <div className="flex-1">
                    <label className="block text-gray-700 font-medium">Chọn vaccine</label>
                    <select
                        value={currentVaccineId}
                        onChange={(e) => setCurrentVaccineId(e.target.value)}
                        className="w-full p-2 border rounded-md outline-none max-h-20 overflow-y-scroll"
                    >
                        <option value="">Chọn vaccine</option>
                        {availableVaccines.map((vaccine, index) => (
                            <option key={index} value={vaccine.vaccineId}>
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
                    disabled={!currentVaccineId}
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
                                <th className="p-2 text-left text-gray-700 font-medium">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedVaccines.map((vaccine, index) => (
                                <tr key={index} className="border-t">
                                    <td className="p-2">{vaccine.vaccineName}</td>
                                    <td className="p-2">{vaccine.doseQuantity}</td>
                                    <td className="p-2 flex justify-left">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveVaccine(vaccine.vaccineId)}
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

            <button
                type="button"
                onClick={onSubmitVaccines}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                disabled={isLoading}
            >
                {isLoading ? "Đang cập nhật..." : "Cập nhật danh sách vaccine"}
            </button>
        </div>
    );
};

export default VaccinesTab;