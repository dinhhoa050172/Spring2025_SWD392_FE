import { useState } from "react";
import { IoMdClose } from "react-icons/io";

const VaccineModal = ({ isOpen, onClose, vaccines = [], vaccinePackages = [], selectedVaccines, setSelectedVaccines }) => {
    if (!isOpen) return null;

    const [filter, setFilter] = useState("single");

    // Lọc danh sách vaccine theo loại
    const filteredVaccines = vaccines.filter(vaccine => vaccine.type === "single");
    const filteredVaccinePackages = vaccinePackages.filter(pkg => pkg.type === "package");

    const handleSelect = (vaccine) => {
        if (filter === "package") {
            setSelectedVaccines([vaccine]); // Chỉ có thể chọn một gói
        } else {
            const alreadySelected = selectedVaccines.some((v) => v.vaccineId === vaccine.vaccineId);
            if (alreadySelected) {
                setSelectedVaccines(selectedVaccines.filter((v) => v.vaccineId !== vaccine.vaccineId));
            } else {
                setSelectedVaccines([...selectedVaccines, vaccine]);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[40rem]">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold ml-[2.5rem] md:ml-[10.25rem]">Chọn Vắc xin phòng bệnh</h2>
                    <IoMdClose size={24} onClick={onClose} className="cursor-pointer"/>
                </div>
                <p className="text-gray-600 text-sm">Quý khách có thể chọn 1 hoặc nhiều vắc xin để được tư vấn.</p>
                
                {/* Tabs lọc */}
                <div className="flex gap-2 my-4">
                    <button className={`px-4 py-2 rounded ${filter === "single" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
                        onClick={() => { setFilter("single"); setSelectedVaccines([]); }}>
                        Tiêm lẻ
                    </button>
                    <button className={`px-4 py-2 rounded ${filter === "package" ? "bg-blue-500 text-white" : "bg-gray-200"}`} 
                        onClick={() => { setFilter("package"); setSelectedVaccines([]); }}>
                        Gói
                    </button>
                </div>
                
                {/* Danh sách vaccine */}
                {filter === "single" && (
                    <div className="max-h-60 overflow-y-auto">
                        {filteredVaccines.length > 0 ? filteredVaccines.map((vaccine) => (
                            <label key={vaccine.vaccineId} className="flex items-center justify-between p-2 border-b cursor-pointer">
                                <span>{vaccine.vaccineName}</span>
                                <input
                                    type="checkbox"
                                    checked={selectedVaccines.some((v) => v.vaccineId === vaccine.vaccineId)}
                                    onChange={() => handleSelect(vaccine)}
                                    className="w-5 h-5"
                                />
                            </label>
                        )) : <p className="text-center text-gray-500">Không có vaccine nào.</p>}
                    </div>
                )}
                
                {/* Danh sách gói vaccine */}
                {filter === "package" && (
                    <div className="max-h-60 overflow-y-auto">
                        {filteredVaccinePackages.length > 0 ? filteredVaccinePackages.map((pkg) => (
                            <label key={pkg.id} className="flex items-center justify-between p-2 border-b cursor-pointer">
                                <span>{pkg.name}</span>
                                <input
                                    type="radio"
                                    checked={selectedVaccines.some((v) => v.id === pkg.id)}
                                    onChange={() => handleSelect(pkg)}
                                    className="w-5 h-5"
                                />
                            </label>
                        )) : <p className="text-center text-gray-500">Không có gói vaccine nào.</p>}
                    </div>
                )}

                {/* Nút áp dụng và đóng */}
                <button className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-4" onClick={onClose}>Áp dụng</button>
            </div>
        </div>
    );
};

export default VaccineModal;
