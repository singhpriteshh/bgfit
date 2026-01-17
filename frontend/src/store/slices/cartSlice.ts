import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import type { CartItem, OrderResponse } from "../../types";

export interface CartState {
  items: CartItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CartItem[]>("/cart");
      return response.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to load cart",
      );
    }
  },
);

export const addToCart = createAsyncThunk(
  "cart/add",
  async (
    item: { product_id: string; quantity: number; size: string; color: string },
    { dispatch, rejectWithValue },
  ) => {
    try {
      await api.post("/cart", item);
      dispatch(fetchCart()); // Refresh cart
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to add to cart",
      );
    }
  },
);

export const removeFromCart = createAsyncThunk(
  "cart/remove",
  async (id: string, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/cart/${id}`);
      dispatch(fetchCart()); // Refresh cart
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || "Failed to remove item",
      );
    }
  },
);

export const checkout = createAsyncThunk(
  "cart/checkout",
  async ({ totalAmount }: { totalAmount: number }, { rejectWithValue }) => {
    try {
      const response = await api.post<OrderResponse>(
        `/payment/create-order?amount=${totalAmount * 100}&currency=INR`,
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || "Checkout failed");
    }
  },
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add/Remove usually trigger fetchCart, so we might not need separate handlers
      // unless we want optimistic updates.
      // Basic success/error handling for them:
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
