import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { staffService } from "@src/services/staffService.js";
import { fileToCloud } from "@utils/telerealm.js";
import { toast } from "react-toastify";
import { message } from "@utils/message.js";

export default function UpdateBlogModal({ open, handleClose, onSubmit, blogId }) {
  const [formData, setFormData] = useState({
    authorId: "",
    title: "",
    shortDescription: "",
    content: "",
    imageUrl: "",
    status: "DRAFT",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ title: "", content: "" });

  useEffect(() => {
    if (open && blogId) {
      fetchBlogDetails();
    }
  }, [open, blogId]);

  const fetchBlogDetails = async () => {
    setIsLoading(true);
    try {
      const blogData = await staffService.getDetailBlog(blogId);
      setFormData({
        authorId: blogData.authorId || "",
        title: blogData.title || "",
        shortDescription: blogData.shortDescription || "",
        content: blogData.content || "",
        imageUrl: blogData.imageUrl || "",
        status: blogData.status || "DRAFT",
      });
    } catch (error) {
      console.error(message.ERROR_FETCH_DATA, error);
      toast.error(message.ERROR_FETCH_DATA);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await fileToCloud(file);
        if (response && response.data.url) {
          setFormData({ ...formData, imageUrl: response.data.url });
        }
      } catch (error) {
        console.error(message.UPLOAD_ERROR, error);
      }
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({ title: "", content: "" });

    let formErrors = {};

    if (!formData.title.trim()) {
      formErrors.title = "Tiêu đề không được để trống!";
    }
    if (!formData.content.trim()) {
      formErrors.content = "Nội dung không được để trống!";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsLoading(false);
      return;
    }

    try {
      await staffService.updateBlog({id:blogId, ...formData});
      onSubmit();
      handleClose();
    } catch (err) {
      console.error(message.UPDATE_ERROR, err);
      toast.error(message.UPDATE_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Cập nhật Blog</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <TextField
              label="Tiêu đề"
              name="title"
              fullWidth
              margin="dense"
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              label="Mô tả ngắn"
              name="shortDescription"
              fullWidth
              margin="dense"
              value={formData.shortDescription}
              onChange={handleChange}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Blog"
                style={{ width: "100px", height: "60px", marginTop: "10px" }}
              />
            )}
            <ReactQuill value={formData.content} onChange={handleContentChange} />
            {errors.content && <p style={{ color: "red" }}>{errors.content}</p>}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} /> : "Cập nhật"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
