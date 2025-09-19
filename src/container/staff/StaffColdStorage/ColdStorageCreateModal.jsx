import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiX,
  FiThermometer,
  FiCalendar,
  FiMapPin,
  FiBox,
  FiDatabase,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
} from "react-icons/fi";
import {
  FaIndustry,
  FaTemperatureLow,
  FaTemperatureHigh,
} from "react-icons/fa";
import coldStorageService from "@src/services/coldStorageService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

const ColdStorageCreateModal = ({ isOpen, onClose, refreshData }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const now = new Date().toISOString().split("T")[0];
  const isActiveValue = watch("isActive");
  const storageType = watch("type");

   // Validation tùy chỉnh cho sức chứa dựa trên loại kho
  const validateCapacity = (value) => {
    const capacity = Number(value);
    
    if (storageType === "Nhỏ" && (capacity < 0 || capacity > 300)) {
      return "Sức chứa phải từ 0-300 lọ cho kho nhỏ";
    }
    if (storageType === "Trung" && (capacity < 301 || capacity > 500)) {
      return "Sức chứa phải từ 301-500 lọ cho kho trung";
    }
    if (storageType === "Lớn" && (capacity < 501 || capacity > 1000)) {
      return "Sức chứa phải từ 501-1000 lọ cho kho lớn";
    }
    return true;
  };

  // Xử lý khi loại kho thay đổi
  useEffect(() => {
    if (storageType) {
      clearErrors("storageCapacity");
    }
  }, [storageType, clearErrors]);

  const validateTemperature = (value) => {
    const temp = Number(value);
    const minTemp = Number(watch("minTemperatureThreshold"));
    const maxTemp = Number(watch("maxTemperatureThreshold"));
    
    if (temp < minTemp || temp > maxTemp) {
      return `Nhiệt độ phải nằm trong khoảng ${minTemp}°C đến ${maxTemp}°C`;
    }
    return true;
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      if(data.purchaseDate >= now){
        return toast.error(
          message.ERROR_CREATE +
            " Ngày mua phải nhỏ hơn ngày hiện tại.",{
            autoClose: 4000,
            closeOnClick: true,
            }
        );
      }
      if (data.effectiveFrom < data.purchaseDate) {
        return toast.error(
          message.ERROR_CREATE +
            " Ngày hoạt động phải lớn hơn hoặc bằng ngày mua.",{
            autoClose: 4000,
            closeOnClick: true,
            }
        );
      }
      if (data.effectiveFrom < now) {
        return toast.error(
          message.ERROR_CREATE +
            " Ngày hoạt động phải lớn hơn hoặc bằng ngày hiện tại.",{
            autoClose: 4000,
            closeOnClick: true,
            }
        );
      }
      const formData = {
        ...data,
        storageCapacity: parseInt(data.storageCapacity),
        currentTemperature: parseInt(data.currentTemperature),
        maxTemperatureThreshold: parseInt(data.maxTemperatureThreshold),
        minTemperatureThreshold: parseInt(data.minTemperatureThreshold),
        temperatureScale: "C",
        currentVialCount: 0,
      };
      const response = await coldStorageService.create(formData);

      toast.success(message.COLDSTORAGE_SUCCESS,{
        autoClose: 4000,
        closeOnClick: true,
      });

      refreshData();
      reset();
      onClose();
    } catch (error) {
      console.error(message.COLDSTORAGE_ERROR, error);
      toast.error(message.COLDSTORAGE_ERROR, {
        autoClose: 4000,
        closeOnClick: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
          <div className="flex items-center">
            <FiThermometer className="text-blue-600 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Tạo Kho Lạnh Mới
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiBox className="mr-2 text-blue-500" />
                Thông tin cơ bản
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiBox className="mr-2" />
                    Tên Kho
                  </label>
                  <input
                    {...register("coldStorageName", {
                      required: "Tên kho là bắt buộc",
                    })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.coldStorageName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.coldStorageName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FaIndustry className="mr-2" />
                    Nhà Sản Xuất
                  </label>
                  <input
                    {...register("manufacturer", {
                      required: "Nhà sản xuất là bắt buộc",
                    })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.manufacturer && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.manufacturer.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiBox className="mr-2" />
                    Loại
                  </label>
                  <select
                    {...register("type", { required: "Loại là bắt buộc" })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Chọn loại kho</option>
                    <option value="Lớn">Lớn</option>
                    <option value="Trung">Trung</option>
                    <option value="Nhỏ">Nhỏ</option>
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiMapPin className="mr-2" />
                    Vị Trí
                  </label>
                  <input
                    {...register("locationHierarchy", {
                      required: "Vị trí là bắt buộc",
                    })}
                    placeholder="Ví dụ: khu 1 -> khu vực A"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.locationHierarchy && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.locationHierarchy.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Status Card */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FiCalendar className="mr-2 text-blue-500" />
                Thông tin ngày tháng
              </h3>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiCalendar className="mr-2" />
                    Ngày Mua
                  </label>
                  <input
                    type="date"
                    {...register("purchaseDate", {
                      required: "Ngày mua là bắt buộc",
                    })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.purchaseDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.purchaseDate.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiCalendar className="mr-2" />
                    Ngày Hoạt Động
                  </label>
                  <input
                    type="date"
                    {...register("effectiveFrom", {
                      required: "Ngày hoạt động là bắt buộc",
                    })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.effectiveFrom && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.effectiveFrom.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    {isActiveValue === "true" ? (
                      <FiCheckCircle className="mr-2 text-green-500" />
                    ) : (
                      <FiAlertCircle className="mr-2 text-yellow-500" />
                    )}
                    Trạng Thái
                  </label>
                  <select
                    {...register("isActive", {
                      required: "Trạng thái là bắt buộc",
                    })}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="true">Hoạt động</option>
                    <option value="false">Tạm dừng</option>
                  </select>
                  {errors.isActive && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.isActive.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Temperature Settings Card */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiThermometer className="mr-2 text-blue-500" />
              Cài đặt nhiệt độ (°C)
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                  <FaTemperatureLow className="mr-2" />
                  Ngưỡng Nhiệt Độ Thấp Nhất (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("minTemperatureThreshold", {
                    required: "Ngưỡng thấp nhất là bắt buộc",
                    min: { value: -80, message: "Tối thiểu -80°C" },
                    max: { value: 10, message: "Tối đa 10°C" },
                    validate: (val) => {
                      const max = Number(watch("maxTemperatureThreshold"));
                      if (Number(val) >= max) return "Ngưỡng thấp phải nhỏ hơn ngưỡng cao";
                      return true;
                    }
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.minTemperatureThreshold && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.minTemperatureThreshold.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                  <FaTemperatureHigh className="mr-2" />
                  Ngưỡng Nhiệt Độ Cao Nhất (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("maxTemperatureThreshold", {
                    required: "Ngưỡng cao nhất là bắt buộc",
                    min: { value: -80, message: "Tối thiểu -80°C" },
                    max: { value: 10, message: "Tối đa 10°C" },
                    validate: (val) => {
                      const min = Number(watch("minTemperatureThreshold"));
                      if (Number(val) <= min) return "Ngưỡng cao phải lớn hơn ngưỡng thấp";
                      return true;
                    }
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.maxTemperatureThreshold && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.maxTemperatureThreshold.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                  <FiThermometer className="mr-2" />
                  Nhiệt Độ Hiện Tại (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register("currentTemperature", {
                    required: "Nhiệt độ hiện tại là bắt buộc",
                    validate: validateTemperature
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.currentTemperature && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentTemperature.message}
                  </p>
                )}
              </div>
            </div>
          </div>

            {/* Capacity Card */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FiDatabase className="mr-2 text-blue-500" />
              Thông tin lưu trữ
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                  <FiDatabase className="mr-2" />
                  Sức Chứa (lọ)
                </label>
                <input
                  type="number"
                  {...register("storageCapacity", {
                    required: "Sức chứa là bắt buộc",
                    validate: validateCapacity,
                    valueAsNumber: true,
                  })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!storageType} // Disable nếu chưa chọn loại kho
                />
                {storageType && (
                  <p className="text-sm text-gray-500 mt-1">
                    {storageType === "Nhỏ" && "Giới hạn: 0-300 lọ"}
                    {storageType === "Trung" && "Giới hạn: 301-500 lọ"}
                    {storageType === "Lớn" && "Giới hạn: 501-1000 lọ"}
                  </p>
                )}
                {errors.storageCapacity && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.storageCapacity.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          </div>

          {/* Footer Buttons */}
          <div className="sticky bottom-0 bg-white border-t p-4 mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
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
                </>
              ) : (
                <>
                  <FiPlus className="mr-2" />
                  Tạo kho lạnh
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ColdStorageCreateModal;
