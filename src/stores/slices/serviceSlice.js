import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { servicePackageVaccine } from "@src/services/servicePackageVaccine.js";

// Thunk action để fetch vaccine từ servicePackageVaccine
export const fetchVaccines = createAsyncThunk(
  "service/fetchVaccines",
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicePackageVaccine.getAllPackageVaccine();
      return response; // Dữ liệu trả về từ API
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchVaccineAndPackages = createAsyncThunk(
  "service/fetchVaccineAndPackages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await servicePackageVaccine.getAllVaccineAndPackage();
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState: {
    vaccines: [],
    vaccinesAndPackages: {},
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {}, // Nếu có reducer khác, thêm vào đây
  extraReducers: (builder) => {
    builder
      .addCase(fetchVaccines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVaccines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vaccines = action.payload;
      })
      .addCase(fetchVaccines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchVaccineAndPackages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVaccineAndPackages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.vaccinesAndPackages = action.payload;
      })
      .addCase(fetchVaccineAndPackages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default serviceSlice.reducer;
