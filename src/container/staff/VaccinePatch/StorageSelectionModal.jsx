import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
} from "@mui/material";
import coldStorageService from "@src/services/coldStorageService.js";
import { message } from "@utils/message.js";

const StorageSelectionModal = ({ open, onClose, vaccineBatch, onConfirm }) => {
  const [coldStorages, setColdStorages] = useState([]);
  const [selectedStorageId, setSelectedStorageId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchColdStorages();
    }
  }, [open]);

  const fetchColdStorages = async () => {
    try {
      setLoading(true);
      const response = await coldStorageService.getAllColdStorages();
      console.log(response.content);
      if (response.content) {
        setColdStorages(response.content);
      }
    } catch (err) {
      console.error(message.ERROR_FETCH_DATA, err);
    } finally {
      setLoading(false);
    }
  };

  if (!vaccineBatch) return null;

  const handleConfirm = () => {
    if (!selectedStorageId) {
      setError(message.SELECT_COLD_STORAGE);
      return;
    }

    const selectedStorage = coldStorages.find(
      (storage) => storage.id === selectedStorageId
    );

    if (
      selectedStorage?.minTemperatureThreshold >
        vaccineBatch?.maxTemperatureConditions ||
      selectedStorage?.maxTemperatureThreshold <
        vaccineBatch?.minTemperatureConditions
    ) {
      setError("Kho lạnh không đáp ứng điều kiện nhiệt độ bảo quản vaccine");
      return;
    }

    onConfirm(selectedStorageId);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chọn kho lạnh để cất vaccine</DialogTitle>
      <DialogContent>
        {loading ? (
          <p>Đang tải danh sách kho lạnh...</p>
        ) : (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel id="storage-select-label">Kho lạnh</InputLabel>
              <Select
                labelId="storage-select-label"
                value={selectedStorageId}
                onChange={(e) => {
                  setSelectedStorageId(e.target.value);
                  setError(null);
                }}
                label="Kho lạnh"
              >
                {coldStorages.map((storage) => (
                  <MenuItem
                    key={storage.id}
                    value={storage.id}
                    disabled={
                      storage?.minTemperatureThreshold >
                        vaccineBatch?.maxTemperatureConditions ||
                      storage?.maxTemperatureThreshold <
                        vaccineBatch?.minTemperatureConditions ||
                      (storage?.maxTemperatureThreshold >
                        vaccineBatch?.maxTemperatureConditions &&
                        storage?.minTemperatureThreshold <
                          vaccineBatch?.minTemperatureConditions) ||
                      storage.storageCapacity - storage.currentVialCount <
                        vaccineBatch?.currentQuantity ||
                        storage?.effectiveFrom > new Date().toISOString().split("T")[0]
                    }
                  >
                    {storage.coldStorageName} - Nhiệt độ:{" "}
                    {storage.minTemperatureThreshold}°C đến{" "}
                    {storage.maxTemperatureThreshold}°C - Chỗ trống:{" "}
                    {storage.storageCapacity - storage.currentVialCount}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
            <div style={{ marginTop: "16px" }}>
              <p>
                <strong>Yêu cầu nhiệt độ vaccine:</strong>
              </p>
              <p>Tối thiểu: {vaccineBatch.minTemperatureConditions}°C</p>
              <p>Tối đa: {vaccineBatch.maxTemperatureConditions}°C</p>
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button
          onClick={handleConfirm}
          color="primary"
          variant="contained"
          disabled={!selectedStorageId || loading}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StorageSelectionModal;
