import { useForm } from "react-hook-form";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { userService } from "@src/services/userService.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({mode: "onBlur"});
  const userId = localStorage.getItem("userId");

  const onSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        toast.error("Mật khẩu mới và xác nhận lại mật khẩu mới không trùng nhau!");
        return;
      }

      const response = await userService.changePassword(
        userId, 
        data.oldPassword, 
        data.newPassword
      );
      if(response.code === "200"){
        toast.success(message.CHANGE_PASSWORD_SUCCESS, {
          autoClose: 4000,
          closeOnClick: true,
        });
      } else {
        toast.error(message.CHANGE_PASSWORD_ERROR + " " + response.data, {
          autoClose: 4000,
          closeOnClick: true,
        });
      }
      reset();
      onClose();
    } catch (error) {
      console.error(message.CHANGE_PASSWORD_ERROR, error);
      toast.error(error.data || message.CHANGE_PASSWORD_ERROR);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Đổi Mật Khẩu</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="oldPassword" className="block text-sm font-medium">Mật khẩu cũ</label>
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Nhập mật khẩu cũ"
              {...register("oldPassword", { required: "Mật khẩu cũ không được để trống!" })}
            />
            {errors.oldPassword && <p className="text-red-500 text-sm">{errors.oldPassword.message}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm font-medium">Mật khẩu mới</label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Nhập mật khẩu mới"
              {...register("newPassword", {
                required: "Mật khẩu mới không được để trống!",
                minLength: {
                  value: 8,
                  message: "Mật khẩu phải có ít nhất 8 ký tự",
                },
                validate: {
                  hasUpperCase: (value) =>
                    /[A-Z]/.test(value) || "Mật khẩu phải có ít nhất 1 ký tự viết hoa",
                  hasLowerCase: (value) =>
                    /[a-z]/.test(value) || "Mật khẩu phải có ít nhất 1 ký tự viết thường",
                  hasNumber: (value) =>
                    /\d/.test(value) || "Mật khẩu phải có ít nhất 1 số",
                  hasSpecialChar: (value) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(value) || "Mật khẩu phải có ký tự đặc biệt",
                }
              })}
            />
            {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium">Nhập lại mật khẩu mới</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className="mt-1 p-2 w-full border rounded"
              placeholder="Nhập lại mật khẩu mới"
              {...register("confirmPassword", {
                required: "Mật khẩu mới không được để trống!",
              })}
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
          reset();
          onClose();
        }} color="error" variant="contained">
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit(onSubmit)} 
          color="primary" 
          variant="contained"
        >
          Đổi mật khẩu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangePasswordModal;
