import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import {
  FaUser,
  FaCalendarAlt,
  FaVenusMars,
  FaHospital,
  FaExclamationTriangle,
  FaRulerVertical,
  FaWeight,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { userService } from "@src/services/userService.js";
import { useState } from "react";
import { message } from "@utils/message.js";

const RegisterProfileChild = ({
  onClose,
  isOpen,
  parentInfo,
  onRegisterSuccess,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    const updatedData = {
      ...data,
      customerId: parentInfo.id,
      parentName: parentInfo.fullname,
    };

    try {
      const response = await userService.registerChildProfile(updatedData);
      if (!response) {
        toast.error(message.REGISTER_ERROR, {
          autoClose: 4000,
          closeOnClick: true,
        });
      } else {
        toast.success(message.REGISTER_SUCCESS, {
          autoClose: 4000,
          closeOnClick: true,
        });
        onClose();
        reset();
        onRegisterSuccess();
      }
    } catch (error) {
      console.error(message.REGISTER_ERROR, error);
      toast.error(message.REGISTER_ERROR, {
        autoClose: 4000,
        closeOnClick: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Đăng ký hồ sơ cho trẻ</DialogTitle>
      <DialogContent dividers>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <TextField
            label="Họ và tên"
            fullWidth
            variant="outlined"
            {...register("childName", { required: "Nhập họ và tên" })}
            error={!!errors.childName}
            helperText={errors.childName?.message}
            InputProps={{
              startAdornment: <FaUser className="mr-2 text-gray-500" />,
            }}
          />

          <div className="grid grid-cols-2 gap-4">
            <TextField
              select
              label="Giới tính"
              fullWidth
              variant="outlined"
              {...register("childGender", { required: "Chọn giới tính" })}
              error={!!errors.childGender}
              helperText={errors.childGender?.message}
              InputProps={{
                startAdornment: <FaVenusMars className="mr-2 text-gray-500" />,
              }}
            >
              <MenuItem value="M">Nam</MenuItem>
              <MenuItem value="F">Nữ</MenuItem>
            </TextField>

            <TextField
              type="date"
              label="Ngày sinh"
              fullWidth
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              {...register("dateOfBirth", { required: "Nhập ngày sinh" })}
              error={!!errors.dateOfBirth}
              helperText={errors.dateOfBirth?.message}
              InputProps={{
                startAdornment: (
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                ),
              }}
            />
          </div>

          <TextField
            label="Nơi sinh"
            fullWidth
            variant="outlined"
            {...register("birthPlace", { required: "Nhập nơi sinh" })}
            error={!!errors.birthPlace}
            helperText={errors.birthPlace?.message}
            InputProps={{
              startAdornment: <FaHospital className="mr-2 text-gray-500" />,
            }}
          />

          <TextField
            select
            label="Phương pháp sinh"
            fullWidth
            variant="outlined"
            {...register("birthMethod", { required: "Chọn phương pháp sinh" })}
            error={!!errors.birthMethod}
            helperText={errors.birthMethod?.message}
            InputProps={{
              startAdornment: <FaHospital className="mr-2 text-gray-500" />,
            }}
          >
            <MenuItem value="Sinh thường">Sinh thường</MenuItem>
            <MenuItem value="Sinh mổ">Sinh mổ</MenuItem>
          </TextField>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              label="Cân nặng (kg)"
              type="number"
              fullWidth
              variant="outlined"
              {...register("birthWeight", {
                required: "Nhập cân nặng hợp lệ",
                min: { value: 2, message: "Cân nặng phải lớn hơn 2kg" },
                max: { value: 100, message: "Cân nặng phải nhỏ hơn 100kg" },
              })}
              error={!!errors.birthWeight}
              helperText={errors.birthWeight?.message}
              InputProps={{
                startAdornment: <FaWeight className="mr-2 text-gray-500" />,
              }}
            />

            <TextField
              label="Chiều cao (cm)"
              type="number"
              fullWidth
              variant="outlined"
              {...register("birthHeight", {
                required: "Nhập chiều cao hợp lệ",
                min: { value: 50, message: "Chiều cao phải lớn hơn 50cm" },
                max: { value: 200, message: "Chiều cao phải nhỏ hơn 200cm" },
              })}
              error={!!errors.birthHeight}
              helperText={errors.birthHeight?.message}
              InputProps={{
                startAdornment: (
                  <FaRulerVertical className="mr-2 text-gray-500" />
                ),
              }}
            />
          </div>

          <TextField
            label="Bất thường khi sinh (nếu có)"
            fullWidth
            variant="outlined"
            {...register("abnormalities")}
            InputProps={{
              startAdornment: (
                <FaExclamationTriangle className="mr-2 text-gray-500" />
              ),
            }}
          />

          <DialogActions>
            <Button onClick={onClose} variant="contained" color="error">
              Hủy
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={26} sx={{ mx: "18px" }} />
              ) : (
                "Đăng ký"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterProfileChild;
