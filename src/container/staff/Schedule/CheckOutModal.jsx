import { useForm } from 'react-hook-form';
import { Modal, Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { appointmentService } from '@src/services/appointmentService.js';
import { toast } from 'react-toastify';
import { message } from '@utils/message.js';
import { useState, useEffect } from 'react';

const CheckoutModal = ({ open, onClose, appointment, onRefresh }) => {
    const [loading, setLoading] = useState(false);
    const [showAbnormalities, setShowAbnormalities] = useState(false);
    const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
        defaultValues: {
            appointmentDetailId: appointment?.appointmentDetailId || "",
            status: "",
            abnormalities: "",
            temperature: "",
        },
        mode: "onBlur",
    });

    const status = watch("status");

    useEffect(() => {
        if (status === "Bất thường") {
            setShowAbnormalities(true);
        } else {
            setShowAbnormalities(false);
            setValue("abnormalities", "");
        }
    }, [status, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const response = await appointmentService.updatePostVaccinationInfo(data);
            if (response.code !== "201") {
                return toast.error(message.UPDATE_ERROR);
            }
            const response1 = await appointmentService.updateStatus(appointment.appointmentDetailId, "COMPLETED");
            if (response1.code === "200") {
                toast.success(message.UPDATE_SUCCESS, {
                    autoClose: 1000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                onClose();
                onRefresh();
            } else {
                toast.error(message.UPDATE_ERROR);
            }
        } catch (error) {
            console.error(message.UPDATE_ERROR, error);
            toast.error(message.UPDATE_ERROR + error.details[0]);
        } finally {
            setLoading(false);
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
                    width: 400,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Typography variant="h6" component="h2" gutterBottom>
                    Thông tin sau tiêm
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormControl fullWidth margin="normal" error={!!errors.status}>
                        <InputLabel id="status-label">Tình trạng sau tiêm</InputLabel>
                        <Select
                            labelId="status-label"
                            label="Tình trạng sau tiêm"
                            {...register("status", { required: "Trường này là bắt buộc" })}
                        >
                            <MenuItem value="Bình thường">Bình thường</MenuItem>
                            <MenuItem value="Bất thường">Bất thường</MenuItem>
                        </Select>
                        {errors.status && (
                            <Typography variant="caption" color="error">
                                {errors.status.message}
                            </Typography>
                        )}
                    </FormControl>

                    {showAbnormalities && (
                        <TextField
                            label="Bất thường sau tiêm"
                            {...register("abnormalities", { required: showAbnormalities ? "Trường này là bắt buộc" : false })}
                            fullWidth
                            margin="normal"
                            error={!!errors.abnormalities}
                            helperText={errors.abnormalities?.message}
                        />
                    )}

                    <TextField
                        label="Nhiệt độ (°C)"
                        type="number"
                        {...register("temperature", {
                            required: "Trường này là bắt buộc",
                            min: { value: 35, message: "Nhiệt độ phải từ 35°C trở lên" },
                            max: { value: 42, message: "Nhiệt độ không được vượt quá 42°C" },
                        })}
                        fullWidth
                        margin="normal"
                        inputProps={{ step: 0.1 }}
                        error={!!errors.temperature}
                        helperText={errors.temperature?.message}
                    />

                    <div className="flex justify-end gap-2">
                        <Button variant="outlined" onClick={onClose}>
                            Hủy
                        </Button>
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Xác nhận"}
                        </Button>
                    </div>
                </form>
            </Box>
        </Modal>
    );
};

export default CheckoutModal;