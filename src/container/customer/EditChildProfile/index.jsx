import { userService } from "@src/services/userService.js";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
  FaTimes,
  FaHospital,
  FaExclamationTriangle,
  FaRulerVertical,
  FaWeight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Modal, Box, Typography, Button } from "@mui/material";
import { message } from "@utils/message.js";

const EditProfileChild = ({ onClose, isOpen, childId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchChild = async () => {
      const reponse = await userService.getChildById(childId);
      setValue("childName", reponse.childName);
      setValue("childGender", reponse.childGender);
      setValue("dateOfBirth", reponse.dateOfBirth);
      setValue("birthPlace", reponse.birthPlace);
      setValue("birthMethod", reponse.birthMethod);
      setValue("birthWeight", reponse.birthWeight);
      setValue("birthHeight", reponse.birthHeight);
      setValue("abnormalities", reponse.abnormalities);
    };

    fetchChild();
  }, [childId]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    setIsLoading(true);
    const updatedData = {
      ...data,
      parentName: localStorage.getItem("userName"),
      id: childId,
    };

    const response = await userService.updateChildProfile(updatedData);
    setIsLoading(false);
    if (!response) {
      toast.error(message.UPDATE_ERROR,{
        autoClose: 4000,
        closeOnClick: true,
      });
    } else {
      toast.success(message.UPDATE_SUCCESS, {
        autoClose: 4000,
        closeOnClick: true,
      });
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box sx={modalStyle}>
        <Button
          onClick={onClose}
          sx={{ position: "absolute", top: 10, right: 10, color: "gray" }}
        >
          <FaTimes size={20} />
        </Button>

        <Typography variant="h5" textAlign="center" fontWeight="bold" mb={3}>
          Chỉnh sửa hồ sơ cho trẻ
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Họ và tên
            </label>
            <div className="relative flex items-center border-b-2">
              <FaUser className="text-gray-500 mr-3" />
              <input
                {...register("childName", { required: true })}
                placeholder="Nhập họ và tên"
                className="w-full p-2 focus:outline-none"
              />
            </div>
            {errors.childName && (
              <span className="text-red-500 text-sm">Nhập họ và tên</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="mt-3">
              <label className="block text-gray-700 font-semibold mb1 ">
                Giới tính
              </label>
              <div className="relative flex items-center border-b-2">
                <FaVenusMars className="text-gray-500 mr-3" />
                <select
                  {...register("childGender", { required: true })}
                  className="w-full p-2 focus:outline-none text-center"
                >
                  <option value="">----Chọn giới tính----</option>
                  <option value="F">Nữ</option>
                  <option value="M">Nam</option>
                </select>
              </div>
              {errors.childGender && (
                <span className="text-red-500 text-sm">Chọn giới tính</span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Ngày sinh
              </label>
              <div className="relative flex items-center border-b-2">
                <FaCalendarAlt className="text-gray-500 mr-3" />
                <input
                  {...register("dateOfBirth", { required: true })}
                  type="date"
                  className="w-full p-2 focus:outline-none"
                />
              </div>
              {errors.dateOfBirth && (
                <span className="text-red-500 text-sm">Nhập ngày sinh</span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Nơi sinh
            </label>
            <div className="relative flex items-center border-b-2">
              <FaHospital className="text-gray-500 mr-3" />
              <input
                {...register("birthPlace", { required: true })}
                placeholder="Nhập nơi sinh"
                className="w-full p-2 focus:outline-none"
              />
            </div>
            {errors.birthPlace && (
              <span className="text-red-500 text-sm">Nhập nơi sinh</span>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Phương pháp sinh
            </label>
            <div className="relative flex items-center border-b-2">
              <FaHospital className="text-gray-500 mr-3" />
              <select
                {...register("birthMethod", { required: true })}
                className="w-full p-2 focus:outline-none text-center"
              >
                <option value="">----Chọn phương pháp sinh----</option>
                <option value="Sinh thường">Sinh thường</option>
                <option value="Sinh mổ">Sinh mổ</option>
              </select>
            </div>
            {errors.birthMethod && (
              <span className="text-red-500 text-sm">
                Chọn phương pháp sinh
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Cân nặng (kg)
              </label>
              <div className="relative flex items-center border-b-2">
                <FaWeight className="text-gray-500 mr-3" />
                <input
                  {...register("birthWeight", {
                    required: true,
                    valueAsNumber: true,
                    min: { value: 2, message: "Cân nặng phải lớn hơn 2kg" },
                    max: { value: 100, message: "Cân nặng phải nhỏ hơn 100kg" },
                  })}
                  type="number"
                  step="0.1"
                  placeholder="Nhập cân nặng (kg)"
                  className="w-full p-2 focus:outline-none"
                />
              </div>
              {errors.birthWeight && (
                <span className="text-red-500 text-sm">
                  Nhập cân nặng hợp lệ (2kg - 100kg)
                </span>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">
                Chiều cao (cm)
              </label>
              <div className="relative flex items-center border-b-2">
                <FaRulerVertical className="text-gray-500 mr-3" />
                <input
                  {...register("birthHeight", {
                    required: true,
                    valueAsNumber: true,
                    min: { value: 50, message: "Chiều cao phải lớn hơn 50cm" },
                    max: {
                      value: 200,
                      message: "Chiều cao phải nhỏ hơn 200cm",
                    },
                  })}
                  type="number"
                  step="0.1"
                  placeholder="Nhập chiều cao (cm)"
                  className="w-full p-2 focus:outline-none"
                />
              </div>
              {errors.birthHeight && (
                <span className="text-red-500 text-sm">
                  Nhập chiều cao hợp lệ (50cm - 200cm)
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Bất thường khi sinh
            </label>
            <div className="relative flex items-center border-b-2">
              <FaExclamationTriangle className="text-gray-500 mr-3" />
              <input
                {...register("abnormalities")}
                placeholder="Ghi chú (nếu có)"
                className="w-full p-2 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition"
            disabled={isLoading}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật hồ sơ"}
          </button>
        </form>
      </Box>
    </Modal>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
  outline: "none",
};

export default EditProfileChild;
