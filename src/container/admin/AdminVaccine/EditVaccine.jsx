import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, Box, Button, Typography } from "@mui/material";
import vaccineService from "@src/services/vaccineService.js";
import diseaseTypeService from "@src/services/diseaseTypeService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";
import { IoClose } from "react-icons/io5";

const EditVaccine = ({ vaccine, open, onClose, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const vaccineTypes = [
        { value: "Vaccine virus toàn phần", label: "Vaccine virus toàn phần" },
        { value: "Vaccine tiểu đơn vị", label: "Vaccine tiểu đơn vị" },
        { value: "Vaccine axit nucleic", label: "Vaccine axit nucleic" },
        { value: "Vaccine virus trung gian", label: "Vaccine virus trung gian" },
    ];
    const [diseaseTypes, setDiseaseTypes] = useState([]);
    const [vaccineParents, setVaccineParents] = useState([]);
    const [currentVaccineId, setCurrentVaccineId] = useState("");
    const [selectedVaccine, setSelectedVaccine] = useState(null);


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm();



    useEffect(() => {
        const fetchData = async () => {
            try {
                const diseaseResponse = await diseaseTypeService.getAll(0, 100);
                const vaccineResponse = await vaccineService.getAllVaccine();
                setDiseaseTypes(diseaseResponse.data.content || []);
                setVaccineParents(vaccineResponse || []);
            } catch (error) {
                console.error(message.ERROR_FETCH_DATA, error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (vaccine) {
            reset({
                ...vaccine,
                parentId: vaccine.parentId || "",
            });
            setSelectedVaccine(
                vaccine.parentId
                    ? vaccineParents.find((v) => v.id === vaccine.parentId) || null
                    : null
            );
            setCurrentVaccineId(vaccine.parentId || "");
        }
    }, [vaccine, vaccineParents, reset]);

    const handleAddVaccine = () => {
        const selected = vaccineParents.find((v) => v.id === currentVaccineId);
        if (selected) {
            setSelectedVaccine(selected);
            setCurrentVaccineId("");
        }
    };

    const handleRemoveVaccine = () => {
        setSelectedVaccine(null);
    };

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const payload = {
                id: vaccine.id,
                vaccineName: data.vaccineName,
                vaccineType: data.vaccineType,
                manufacturer: data.manufacturer,
                countryOfOrigin: data.countryOfOrigin,
                doseVolume: Number(data.doseVolume),
                dosesPerVial: Number(data.dosesPerVial),
                pricePerDose: Number(data.pricePerDose),
                diseaseTypeId: data.diseaseTypeId,
                lifetimeDoseLimit: Number(data.lifetimeDoseLimit),
                ...(selectedVaccine && { parentId: selectedVaccine.id }),
            };

            const response = await vaccineService.updateVaccine(payload);
            if (response) {
                toast.success(message.UPDATE_SUCCESS);
                onUpdate();
                onClose();
            }
        } catch (error) {
            toast.error(message.UPDATE_ERROR);
            console.error(message.UPDATE_ERROR, error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    maxHeight: "80vh",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    outline: "none",
                    overflowY: "auto",
                    borderRadius: 2,
                    "&::-webkit-scrollbar": { display: "none" },
                    scrollbarWidth: "none",
                    "-ms-overflow-style": "none",
                }}
            >
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography variant="h6" component="h2">
                        Cập nhật Vaccine
                    </Typography>
                    <Button onClick={onClose} sx={{ minWidth: "unset", p: 0 }}>
                        <IoClose size={30} />
                    </Button>
                </Box>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 bg-white">
                    {/* Vaccine Name */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Tên Vaccine</label>
                        <input
                            {...register("vaccineName", { required: "Vui lòng nhập tên vaccine" })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập tên vaccine"
                        />
                        {errors.vaccineName && (
                            <p className="text-red-500 text-sm mt-1">{errors.vaccineName.message}</p>
                        )}
                    </div>

                    {/* Vaccine Type */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Loại Vaccine</label>
                        <Controller
                            name="vaccineType"
                            control={control}
                            rules={{ required: "Vui lòng chọn loại vaccine" }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn loại vaccine</option>
                                    {vaccineTypes.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.vaccineType && (
                            <p className="text-red-500 text-sm mt-1">{errors.vaccineType.message}</p>
                        )}
                    </div>

                    {/* Disease Type */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Phòng bệnh</label>
                        <Controller
                            name="diseaseTypeId"
                            control={control}
                            rules={{ required: "Vui lòng chọn loại bệnh" }}
                            render={({ field }) => (
                                <select
                                    {...field}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn loại bệnh</option>
                                    {diseaseTypes.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.diseaseTypeId && (
                            <p className="text-red-500 text-sm mt-1">{errors.diseaseTypeId.message}</p>
                        )}
                    </div>

                    {/* Manufacturer & Country of Origin */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Nhà sản xuất</label>
                            <input
                                {...register("manufacturer", { required: "Vui lòng nhập nhà sản xuất" })}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập nhà sản xuất"
                            />
                            {errors.manufacturer && (
                                <p className="text-red-500 text-sm mt-1">{errors.manufacturer.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Nơi Xuất xứ</label>
                            <input
                                {...register("countryOfOrigin", { required: "Vui lòng nhập nơi xuất xứ" })}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập nơi xuất xứ"
                            />
                            {errors.countryOfOrigin && (
                                <p className="text-red-500 text-sm mt-1">{errors.countryOfOrigin.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Dose Volume & Doses Per Vial */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Thể tích liều (ml)</label>
                            <input
                                {...register("doseVolume", {
                                    required: "Vui lòng nhập thể tích liều",
                                    pattern: {
                                        value: /^[0-9]+(\.[0-9]+)?$/,
                                        message: "Chỉ nhập số, có thể bao gồm số thập phân",
                                    },
                                })}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập thể tích liều"
                            />
                            {errors.doseVolume && (
                                <p className="text-red-500 text-sm mt-1">{errors.doseVolume.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block font-medium text-gray-700 mb-1">Số liều của 1 lọ vaccine</label>
                            <input
                                {...register("dosesPerVial", {
                                    required: "Vui lòng nhập số liều",
                                    pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                                })}
                                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập số liều"
                            />
                            {errors.dosesPerVial && (
                                <p className="text-red-500 text-sm mt-1">{errors.dosesPerVial.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Vaccine Selection */}
                    <div>
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="flex-1">
                                <label className="block font-medium text-gray-700 mb-1">Chọn vaccine cha</label>
                                <select
                                    value={currentVaccineId}
                                    onChange={(e) => setCurrentVaccineId(e.target.value)}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={selectedVaccine !== null}
                                >
                                    <option value="">Chọn vaccine</option>
                                    {vaccineParents.map((vaccine) => (
                                        <option key={vaccine.id} value={vaccine.id}>
                                            {vaccine.vaccineName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddVaccine}
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                                disabled={!currentVaccineId || selectedVaccine !== null}
                            >
                                Thêm
                            </button>
                        </div>

                        {selectedVaccine ? (
                            <div className="mt-4 border rounded-lg">
                                <table className="w-full bg-gray-50">
                                    <thead className="bg-gray-200 sticky top-0">
                                        <tr>
                                            <th className="p-2 text-left text-gray-700 font-medium">Tên Vaccine</th>
                                            <th className="p-2 text-left text-gray-700 font-medium">Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t hover:bg-gray-100">
                                            <td className="p-2">{selectedVaccine.vaccineName}</td>
                                            <td className="p-2 flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveVaccine}
                                                    className="text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded-md"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-gray-500 mt-2">Chưa có vaccine nào được chọn</p>
                        )}
                    </div>

                    {/* Price Per Dose */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Giá mỗi liều (VND)</label>
                        <input
                            {...register("pricePerDose", {
                                required: "Vui lòng nhập giá mỗi liều",
                                pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                            })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập giá mỗi liều"
                        />
                        {errors.pricePerDose && (
                            <p className="text-red-500 text-sm mt-1">{errors.pricePerDose.message}</p>
                        )}
                    </div>

                    {/* Lifetime Dose Limit */}
                    <div>
                        <label className="block font-medium text-gray-700 mb-1">Giới hạn liều trong đời</label>
                        <input
                            {...register("lifetimeDoseLimit", {
                                required: "Vui lòng nhập giới hạn liều",
                                pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                            })}
                            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập giới hạn liều"
                        />
                        {errors.lifetimeDoseLimit && (
                            <p className="text-red-500 text-sm mt-1">{errors.lifetimeDoseLimit.message}</p>
                        )}
                    </div>


                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        disabled={isLoading}
                    >
                        {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                    </button>
                </form>
            </Box>
        </Modal>
    );
};

export default EditVaccine;