import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService.js";
import { userService } from "@src/services/userService.js";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      console.log("error", error);
      return rejectWithValue(error);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.register(credentials);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/getMe",
  async (accessToken, { rejectWithValue }) => {
    try {
      return await userService.getUser(accessToken);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    accessToken: null,
    isAuthenticated: authService.isAuthenticated(),
    status: "idle",
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload; // Lưu toàn bộ user từ API trả về
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Xử lý getMe
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});
export const { logout } = authSlice.actions;
export default authSlice.reducer;
