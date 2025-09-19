import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  FiX,
  FiArrowLeft,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiTrash2,
} from "react-icons/fi";
import vaccineService from "@src/services/vaccineService.js";
import diseaseTypeService from "@src/services/diseaseTypeService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";
import VaccineIntervalForm from "./VaccineInterval.jsx"; // Import VaccineIntervalForm

const vaccineTypes = [
  { value: "Vaccine virus toàn phần", label: "Vaccine virus toàn phần" },
  { value: "Vaccine tiểu đơn vị", label: "Vaccine tiểu đơn vị" },
  { value: "Vaccine axit nucleic", label: "Vaccine axit nucleic" },
  { value: "Vaccine virus trung gian", label: "Vaccine virus trung gian" },
];

const VaccineCreationModal = ({ open, onClose }) => {
  const [activeStep, setActiveStep] = useState(0); // Quản lý bước hiện tại
  const [vaccineId, setVaccineId] = useState(null); // Lưu vaccineId từ Step 1
  const [lifeNumber, setLifeNumber] = useState(0); // Lưu lifetimeDoseLimit từ Step 1
  const [isLoading, setIsLoading] = useState(false);
  const [vaccineParents, setVaccineParents] = useState([]);
  const [diseaseTypes, setDiseaseTypes] = useState([]);
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [currentVaccineId, setCurrentVaccineId] = useState("");

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    reset,
  } = useForm({ mode: "onBlur" });

  // Fetch dữ liệu vaccine và disease types
  React.useEffect(() => {
    const fetchVaccine = async () => {
      try {
        const response = await vaccineService.getAllVaccine();
        setVaccineParents(response || []);
      } catch (error) {
        console.error("Error fetching vaccines:", error);
        setVaccineParents([]);
      }
    };

    const fetchDiseaseTypes = async () => {
      try {
        const response = await diseaseTypeService.getAll(0, 100);
        setDiseaseTypes(response.data.content || []);
      } catch (error) {
        console.error("Error fetching disease types:", error);
        setDiseaseTypes([]);
      }
    };

    fetchVaccine();
    fetchDiseaseTypes();
  }, []);

  // Xử lý chọn vaccine phụ thuộc
  const handleAddVaccine = () => {
    if (!currentVaccineId || selectedVaccine) return;
    const vaccineToAdd = vaccineParents.find((v) => v.id === currentVaccineId);
    if (vaccineToAdd) {
      setSelectedVaccine(vaccineToAdd);
      setCurrentVaccineId("");
    }
  };

  const handleRemoveVaccine = () => {
    setSelectedVaccine(null);
  };

  // Submit Step 1: Tạo vaccine cơ bản
  const onSubmitStep1 = async (data) => {
    setIsLoading(true);
    if (
      Number(data.maxTemperatureConditions) <=
      Number(data.minTemperatureConditions)
    ) {
      setIsLoading(false);
      return toast.error("Nhiệt độ max phải lớn hơn nhiệt độ min");
    }
    try {
      const payload = {
        vaccineName: data.vaccineName,
        vaccineType: data.vaccineType,
        manufacturer: data.manufacturer,
        countryOfOrigin: data.countryOfOrigin,
        doseVolume: data.doseVolume,
        dosesPerVial: data.dosesPerVial,
        pricePerDose: data.pricePerDose,
        diseaseTypeId: data.diseaseTypeId,
        lifetimeDoseLimit: data.lifetimeDoseLimit || 1,
        maxTemperatureConditions: data.maxTemperatureConditions,
        minTemperatureConditions: data.minTemperatureConditions,
        ...(selectedVaccine && { parentId: selectedVaccine.id }), // Thêm parentId nếu có
      };

      const response = await vaccineService.createVaccine(payload);
      if (response.code === "201") {
        reset();
        toast.success("Tạo vaccine cơ bản thành công!");
        setVaccineId(response.data.id); // Giả định response trả về id trong data
        setLifeNumber(Number(data.lifetimeDoseLimit || 1));
        setActiveStep(1); // Chuyển sang bước 2
      } else {
        toast.error("Có lỗi khi tạo vaccine!");
      }
    } catch (error) {
      toast.error(message.ERROR_CREATE);
      console.error(message.ERROR_CREATE, error);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit Step 2: Callback từ VaccineIntervalForm
  const handleIntervalSubmit = () => {
    // toast.success("Tạo vaccine hoàn tất!");
    setActiveStep(0);
    onClose(); // Đóng modal sau khi hoàn tất cả 2 bước
  };
  // Custom Stepper Component
  const Stepper = ({ steps, activeStep }) => (
    <div className="flex items-center w-full mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                        ${
                          index <= activeStep
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-gray-100 text-gray-400"
                        }`}
            >
              {index < activeStep ? (
                <FiCheckCircle className="text-lg" />
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`mt-2 text-sm font-medium ${
                index <= activeStep ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-4 transition-all duration-300 ${
                index < activeStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        open ? "block" : "hidden"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center p-6 bg-gradient-to-r from-blue-600 to-blue-500 text-white">
          <h2 className="text-2xl font-bold">Tạo Vaccine Mới</h2>
          {activeStep === 0 && (
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <Stepper
            steps={["Thông tin cơ bản", "Thời gian tiêm"]}
            activeStep={activeStep}
          />

          {activeStep === 0 ? (
            <form onSubmit={handleSubmit(onSubmitStep1)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Vaccine Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tên Vaccine <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("vaccineName", {
                      required: "Vui lòng nhập tên vaccine",
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.vaccineName
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Nhập tên vaccine"
                  />
                  {errors.vaccineName && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.vaccineName.message}
                    </p>
                  )}
                </div>

                {/* Vaccine Type */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Loại Vaccine <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="vaccineType"
                    control={control}
                    rules={{ required: "Vui lòng chọn loại vaccine" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.vaccineType
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        }`}
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
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.vaccineType.message}
                    </p>
                  )}
                </div>

                {/* Manufacturer */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nhà sản xuất <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("manufacturer", {
                      required: "Vui lòng nhập nhà sản xuất",
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.manufacturer
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Nhập nhà sản xuất"
                  />
                  {errors.manufacturer && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.manufacturer.message}
                    </p>
                  )}
                </div>

                {/* Country of Origin */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nơi xuất xứ <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("countryOfOrigin", {
                      required: "Vui lòng nhập nơi xuất xứ",
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.countryOfOrigin
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Nhập nơi xuất xứ"
                  />
                  {errors.countryOfOrigin && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.countryOfOrigin.message}
                    </p>
                  )}
                </div>

                {/* Dose Volume */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Thể tích liều (ml) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("doseVolume", {
                      required: "Vui lòng nhập thể tích liều",
                      pattern: {
                        value: /^[0-9]+(\.[0-9]+)?$/,
                        message: "Chỉ nhập số, có thể bao gồm số thập phân",
                      },
                      max: {
                        value: 9.9,
                        message: "Thể tích liều phải nhỏ hơn 10ml",
                      },
                      min: {
                        value: 0.1,
                        message: "Thể tích liều phải lớn hơn 0.1ml",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.doseVolume
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Nhập thể tích liều"
                  />
                  {errors.doseVolume && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.doseVolume.message}
                    </p>
                  )}
                </div>

                {/* Doses Per Vial */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Số liều của 1 lọ vaccine{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("dosesPerVial", {
                      required: "Vui lòng nhập số liều",
                      pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                      min: { value: 1, message: "Số liều phải lớn hơn 0" },
                      max: { value: 3, message: "Số liều phải nhỏ hơn 3" },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.dosesPerVial
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Nhập số liều"
                  />
                  {errors.dosesPerVial && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.dosesPerVial.message}
                    </p>
                  )}
                </div>

                {/* Price Per Dose */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Giá mỗi liều (VND) <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("pricePerDose", {
                      required: "Vui lòng nhập giá mỗi liều",
                      pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                      min: { value: 0, message: "Giá phải lớn hơn 0" },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.pricePerDose
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Nhập giá mỗi liều"
                  />
                  {errors.pricePerDose && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.pricePerDose.message}
                    </p>
                  )}
                </div>

                {/* Lifetime Dose Limit */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Giới hạn liều trong đời{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("lifetimeDoseLimit", {
                      required: "Vui lòng nhập giới hạn liều",
                      pattern: { value: /^[0-9]+$/, message: "Chỉ nhập số" },
                      min: {
                        value: 0,
                        message: "Giới hạn liều phải lớn hơn 0",
                      },
                      max: {
                        value: 10,
                        message: "Giới hạn liều phải nhỏ hơn 10",
                      },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.lifetimeDoseLimit
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Nhập giới hạn liều"
                  />
                  {errors.lifetimeDoseLimit && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.lifetimeDoseLimit.message}
                    </p>
                  )}
                </div>

                {/* min temperature */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nhiệt độ bảo quản thấp nhất vaccine{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("minTemperatureConditions", {
                      required: "Vui lòng nhập nhiệt độ thấp nhất",
                      min: {
                        value: -100,
                        message: "Nhiệt độ phải lớn hơn -100°C",
                      },
                      max: { value: 10, message: "Nhiệt độ phải nhỏ hơn 10°C" },
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.manufacturer
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Vui lòng nhập nhiệt độ"
                  />
                  {errors.minTemperatureConditions && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.minTemperatureConditions.message}
                    </p>
                  )}
                </div>

                {/* max temperature */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nhiệt độ bảo quản lớn nhất vaccine{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("maxTemperatureConditions", {
                      required: "Vui lòng nhập nhiệt độ cao nhất",
                    })}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                      errors.manufacturer
                        ? "border-red-500 focus:ring-red-200"
                        : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                    }`}
                    placeholder="Vui lòng nhập nhiệt độ"
                  />
                  {errors.maxTemperatureConditions && (
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.maxTemperatureConditions.message}
                    </p>
                  )}
                </div>

                {/* Disease Type */}
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phòng bệnh <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    name="diseaseTypeId"
                    control={control}
                    rules={{ required: "Vui lòng chọn loại bệnh" }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                          errors.diseaseTypeId
                            ? "border-red-500 focus:ring-red-200"
                            : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                        }`}
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
                    <p className="text-red-500 text-sm flex items-center mt-1">
                      <FiAlertCircle className="mr-1" />{" "}
                      {errors.diseaseTypeId.message}
                    </p>
                  )}
                </div>

                {/* Vaccine Selection */}
                <div className="col-span-2 space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Vaccine phụ thuộc
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={currentVaccineId}
                      onChange={(e) => setCurrentVaccineId(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition-all"
                      disabled={selectedVaccine !== null}
                    >
                      <option value="">Chọn vaccine</option>
                      {vaccineParents.map((vaccine) => (
                        <option key={vaccine.id} value={vaccine.id}>
                          {vaccine.vaccineName}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={handleAddVaccine}
                      disabled={!currentVaccineId || selectedVaccine !== null}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center"
                    >
                      <FiPlus className="text-lg" />
                    </button>
                  </div>

                  {selectedVaccine && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200 flex justify-between items-center">
                      <span className="font-medium">
                        {selectedVaccine.vaccineName}
                      </span>
                      <button
                        type="button"
                        onClick={handleRemoveVaccine}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <FiTrash2 className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <FiX className="mr-2" /> Hủy
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 disabled:opacity-70 transition-all flex items-center shadow-md"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Tiếp theo{" "}
                      <FiArrowLeft className="ml-2 transform rotate-180" />
                    </span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <VaccineIntervalForm
                lifeNumber={lifeNumber}
                vaccineId={vaccineId}
                onSubmitCallback={handleIntervalSubmit}
              />
              <div className="flex justify-between pt-4">
                {/* <button
                                    onClick={() => setActiveStep(0)}
                                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                                    disabled={activeStep === 1}
                                >
                                    <FiArrowLeft className="mr-2" /> Quay lại
                                </button> */}
                <button
                  onClick={handleIntervalSubmit}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all flex items-center shadow-md"
                >
                  Hoàn thành <FiCheckCircle className="ml-2" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaccineCreationModal;
