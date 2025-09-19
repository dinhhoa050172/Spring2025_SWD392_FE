import {
  FiX,
  FiPlus,
  FiTrash2,
  FiSave,
  FiDollarSign,
  FiCalendar,
  FiTruck,
  FiUser,
  FiMapPin,
  FiEdit,
} from "react-icons/fi";
import { FaVial, FaIndustry, FaGlobeAmericas } from "react-icons/fa";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import vaccineImportInvoiceService from "@src/services/vaccineImportInvoice.js";
import vaccineService from "@src/services/vaccineService.js";
import { message } from "@utils/message.js";
import { formatDate } from "@utils/format.js";

const CreateRequestImportInvoice = ({ isOpen, onClose, refreshData }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      vaccineImportInvoice: {
        createdBy: "",
        supplierName: "",
        supplierContact: "",
        supplierAddress: "",
        notes: "",
      },
      importInvoiceLineItems: [{}], // Remove default values for line items
    },
  });

  const [vaccines, setVaccines] = useState([]); // All vaccines from API
  const [availableVaccines, setAvailableVaccines] = useState([]); // Vaccines available for selection
  const [selectedVaccines, setSelectedVaccines] = useState([]); // Vaccines added to the table
  const [loadingbtn, setLoadingbtn] = useState(false);
  const [currentVaccineId, setCurrentVaccineId] = useState(""); // Currently selected vaccine in dropdown

  const { fields, append, remove } = useFieldArray({
    control,
    name: "importInvoiceLineItems",
  });

  const watchFields = watch("importInvoiceLineItems"); // Watch the form fields
  const userID = localStorage.getItem("userId");

  const getVaccines = async () => {
    try {
      const response = await vaccineService.getAllVaccine();
      setVaccines(response);
      setAvailableVaccines(response); // Initially, all vaccines are available
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getVaccines();
      reset(); // Reset form when modal opens
      setSelectedVaccines([]); // Reset selected vaccines
      setAvailableVaccines(vaccines); // Reset available vaccines
      setCurrentVaccineId(""); // Reset dropdown
    }
  }, [isOpen]);
  const validateVaccineItem = (item) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đưa về đầu ngày để tránh lệch thời gian

    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1); // Cộng thêm 1 tháng

    if (!item.vaccineId) return "Vui lòng chọn vaccine";
    if (!item.quantity || item.quantity <= 0 || item.quantity > 10000)
      return "Số lượng phải lớn hơn 0 và nhỏ hơn 10.000";
    // if (!item.quantity || item.quantity <= 0) return "Số lượng phải lớn hơn 0";

    if (!item.unitPrice || item.unitPrice <= 0)
      return "Giá tiền phải lớn hơn 0";
    if (!item.manufactureDate) return "Vui lòng chọn ngày sản xuất";
    if (
      new Date(item.manufactureDate) >=
      new Date(new Date().toISOString().split("T")[0])
    )
      return "Ngày sản xuất phải trước ngày hiện tại";
    if (!item.expiryDate) return "Vui lòng chọn ngày hết hạn";
    if (new Date(item.manufactureDate) >= new Date(item.expiryDate))
      return "Ngày sản xuất phải trước ngày hết hạn";
    if (new Date(item.expiryDate).getTime() <= oneMonthLater.getTime()) {
      return "Ngày hết hạn phải sau hôm nay ít nhất 1 tháng";
    }
    return null;
  };
  const handleAddVaccine = (index) => {
    const item = watchFields[index];
    const errorMessage = validateVaccineItem(item);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    const selectedVaccine = vaccines.find((v) => v.id === item.vaccineId);
    if (selectedVaccine) {
      const vaccineToAdd = {
        vaccineId: selectedVaccine.id,
        vaccineName: selectedVaccine.vaccineName,
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        manufactureDate: item.manufactureDate,
        expiryDate: item.expiryDate,
        manufacturer: selectedVaccine.manufacturer,
        originCountry: selectedVaccine.countryOfOrigin,
      };
      setSelectedVaccines((prev) => [...prev, vaccineToAdd]);
      setAvailableVaccines(
        availableVaccines.filter((v) => v.id !== selectedVaccine.id)
      );

      // Reset form fields
      setValue(`importInvoiceLineItems.${index}.vaccineId`, "");
      setValue(`importInvoiceLineItems.${index}.quantity`, 0);
      setValue(`importInvoiceLineItems.${index}.unitPrice`, 0);
      setValue(`importInvoiceLineItems.${index}.manufactureDate`, "");
      setValue(`importInvoiceLineItems.${index}.expiryDate`, "");
    }
  };

  const handleRemoveVaccine = (id) => {
    const removedVaccine = selectedVaccines.find((v) => v.vaccineId === id);
    setSelectedVaccines(selectedVaccines.filter((v) => v.vaccineId !== id));
    setAvailableVaccines([
      ...availableVaccines,
      {
        id: removedVaccine.vaccineId,
        vaccineName: removedVaccine.vaccineName,
        manufacturer: removedVaccine.manufacturer,
        originCountry: removedVaccine.originCountry,
      },
    ]);
  };

  const onSubmit = async (data) => {
    try {
      setLoadingbtn(true);
      if (selectedVaccines.length === 0) {
        toast.error(message.SELECT_VACCINE);
        return;
      }
      const submitData = {
        vaccineImportInvoice: {
          createdBy: userID,
          supplierName: data.vaccineImportInvoice.supplierName,
          supplierContact: data.vaccineImportInvoice.supplierContact,
          supplierAddress: data.vaccineImportInvoice.supplierAddress,
          notes: data.vaccineImportInvoice.notes,
        },
        importInvoiceLineItems: selectedVaccines,
      };

      const response = await vaccineImportInvoiceService.create(submitData);
      if (response.code === "201") {
        toast.success(message.SUCCESS_CREATE, {
          autoClose: 4000,
          closeOnClick: true,
        });
        await refreshData();
        onClose();
      } else {
        toast.error(message.CREATE_ERROR, {
          autoClose: 4000,
          closeOnClick: true,
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingbtn(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-100 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10">
          <div className="flex items-center">
            <FaVial className="text-blue-600 text-2xl mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              Tạo yêu cầu nhập kho vaccine
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Supplier Information */}
          <div className="mb-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FiTruck className="mr-2 text-blue-500" />
              Thông tin nhà cung cấp
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiUser className="mr-2" />
                    Tên nhà cung cấp
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register("vaccineImportInvoice.supplierName", {
                      required: "Vui lòng nhập tên nhà cung cấp",
                    })}
                  />
                  {errors.vaccineImportInvoice?.supplierName && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.vaccineImportInvoice.supplierName.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiMapPin className="mr-2" />
                    Địa chỉ
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register("vaccineImportInvoice.supplierAddress", {
                      required: "Vui lòng nhập địa chỉ",
                    })}
                  />
                  {errors.vaccineImportInvoice?.supplierAddress && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.vaccineImportInvoice.supplierAddress.message}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiEdit className="mr-2" />
                    Số điện thoại
                  </label>
                  <input
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register("vaccineImportInvoice.supplierContact", {
                      required: "Vui lòng nhập số điện thoại",
                      pattern: {
                        value: /^[0-9]+$/,
                        message: "Vui lòng nhập số điện thoại hợp lệ",
                      },
                    })}
                  />
                  {errors.vaccineImportInvoice?.supplierContact && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.vaccineImportInvoice.supplierContact.message}
                    </span>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                    <FiEdit className="mr-2" />
                    Ghi chú
                  </label>
                  <textarea
                    rows="3"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register("vaccineImportInvoice.notes")}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vaccine Items */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <FaVial className="mr-2 text-blue-500" />
              Danh sách vaccine
            </h3>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="bg-white border rounded-lg p-4 mb-4 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                      <FaVial className="mr-2" />
                      Tên vaccine
                    </label>
                    <Controller
                      name={`importInvoiceLineItems.${index}.vaccineId`}
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Chọn vaccine</option>
                          {availableVaccines.map((vaccine) => (
                            <option key={vaccine.id} value={vaccine.id}>
                              {vaccine.vaccineName}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {watchFields[index]?.vaccineId && (
                      <div className="mt-2 text-sm text-gray-600 space-y-1 flex items-end">
                        <p className="flex items-center mr-2">
                          <FaIndustry className="mr-2" />
                          {
                            vaccines.find(
                              (v) => v.id === watchFields[index].vaccineId
                            )?.manufacturer
                          }
                        </p>
                        <p className="flex items-center">
                          <FaGlobeAmericas className="mr-2" />
                          {
                            vaccines.find(
                              (v) => v.id === watchFields[index].vaccineId
                            )?.countryOfOrigin
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                        <FiPlus className="mr-2" />
                        Số lượng
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10000"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        {...register(
                          `importInvoiceLineItems.${index}.quantity`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                        <FiDollarSign className="mr-2" />
                        Giá tiền
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        {...register(
                          `importInvoiceLineItems.${index}.unitPrice`,
                          {
                            valueAsNumber: true,
                          }
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                      <FiCalendar className="mr-2" />
                      Ngày sản xuất
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...register(
                        `importInvoiceLineItems.${index}.manufactureDate`
                      )}
                    />
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700 flex items-center">
                      <FiCalendar className="mr-2" />
                      Ngày hết hạn
                    </label>
                    <input
                      type="date"
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      {...register(
                        `importInvoiceLineItems.${index}.expiryDate`
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleAddVaccine(index)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPlus className="mr-2" />
                    Thêm vào danh sách
                  </button>
                </div>
              </div>
            ))}

            {/* Selected Vaccines Table */}
            {selectedVaccines.length > 0 && (
              <div className="mt-6 border rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <h4 className="text-lg font-semibold flex items-center">
                    <FaVial className="mr-2 text-blue-500" />
                    Danh sách lô vaccine đã thêm
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Tên Vaccine
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Số lượng
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Giá tiền
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Ngày sản xuất
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Ngày hết hạn
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          Hành động
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedVaccines.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {item.vaccineName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.unitPrice.toLocaleString()} VND
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(item.manufactureDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatDate(item.expiryDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveVaccine(item.vaccineId)
                              }
                              className="flex items-center text-white hover:text-black bg-red-600 p-2 rounded-md"
                            >
                              <FiTrash2 className="mr-1" />
                              Xóa
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-end gap-4 border-t pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 hover:text-black transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={loadingbtn}
            >
              {loadingbtn ? (
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
                  <FiSave className="mr-2" />
                  Tạo yêu cầu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequestImportInvoice;
