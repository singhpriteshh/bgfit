import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";

interface SortingOption {
  label: string;
  value: string;
}

interface ShopSettings {
  price_range_min: number;
  price_range_max: number;
  price_range_step: number;
  sorting_options: SortingOption[];
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
      // Backend returns sorting_options as JSON string, need to parse if it comes as string
      // But typically axios might not auto-parse a string field inside JSON object.
      // Let's assume we handle it here.
      const data = response.data;
      if (typeof data.sorting_options === "string") {
        data.sorting_options = JSON.parse(data.sorting_options);
      }
      return data;
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
      // Convert sorting_options back to string for backend
      const payload = { ...settings };
      if (typeof payload.sorting_options !== "string") {
        payload.sorting_options = JSON.stringify(payload.sorting_options);
      }

      const response = await api.put("/settings", payload);
      const data = response.data;
      if (typeof data.sorting_options === "string") {
        data.sorting_options = JSON.parse(data.sorting_options);
      }
      return data;
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
