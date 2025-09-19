import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useForm } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { staffService } from "@src/services/staffService.js";
import { fileToCloud } from "@utils/telerealm.js";
import { message } from "@utils/message.js";
import { toast } from "react-toastify";

export default function CreateBlogModal({ open, handleClose, onSubmit }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      authorId: "",
      shortDescription: "",
      imageUrl: "",
      title: "",
      content: "",
      status: "DRAFT",
    },
  });

  useEffect(() => {
    if (open) {
      const authorId = localStorage.getItem("userId") || "";
      reset({ authorId, shortDescription: "", imageUrl: "", title: "", content: "", status: "DRAFT" });
    }
  }, [open, reset]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await fileToCloud(file);
        if (response?.data?.url) {
          setValue("imageUrl", response.data.url);
        }
      } catch (error) {
        console.error(message.UPLOAD_ERROR, error);
      }
    }
  };

  const onSubmitForm = async (data) => {
    try {
      const response = await staffService.createBlog(data);
      if (!response) {
        toast.error(message.ERROR_CREATE, { autoClose: 4000, closeOnClick: true });
      } else {
        toast.success(message.SUCCESS_CREATE, { autoClose: 4000, closeOnClick: true });
        onSubmit();
        handleClose();
      }
    } catch (err) {
      console.error(message.ERROR_CREATE, err);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Tạo Blog Mới</DialogTitle>
      <DialogContent>
        <TextField
          label="Tiêu đề"
          {...register("title", { required: "Tiêu đề không được để trống!" })}
          fullWidth
          margin="dense"
          error={!!errors.title}
          helperText={errors.title?.message}
        />

        <TextField label="Mô tả" {...register("shortDescription")} fullWidth margin="dense" />

        <input type="file" title="Upload Image" onChange={handleFileChange} />

        <ReactQuill theme="snow" value={watch("content")} onChange={(value) => setValue("content", value)} style={{ height: "200px", marginTop: "10px" }} />
        {errors.content && <p style={{ color: "red", marginTop: "10px" }}>{errors.content.message}</p>}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isSubmitting}>Hủy</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit(onSubmitForm)} disabled={isSubmitting}>
          {isSubmitting ? "Đang tạo..." : "Tạo Blog"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}