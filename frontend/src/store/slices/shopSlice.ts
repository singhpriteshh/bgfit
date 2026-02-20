import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";

interface ShopSettings {
  price_range_min: number;
  price_range_max: number;
  price_range_step: number;
}

interface ShopState {
  settings: ShopSettings | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ShopState = {
  settings: null,
  isLoading: false,
  error: null,
};

export const fetchSettings = createAsyncThunk(
  "shop/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/settings");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch settings",
      );
    }
  },
);

export const updateSettings = createAsyncThunk(
  "shop/updateSettings",
  async (settings: any, { rejectWithValue }) => {
    try {
      const response = await api.put("/settings", settings);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update settings",
      );
    }
  },
);

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Settings
    builder.addCase(fetchSettings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchSettings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.settings = action.payload;
    });
    builder.addCase(fetchSettings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Update Settings
    builder.addCase(updateSettings.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateSettings.fulfilled, (state, action) => {
      state.isLoading = false;
      state.settings = action.payload;
    });
    builder.addCase(updateSettings.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });
  },
});

export default shopSlice.reducer;
