// store/features/cartSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { CartItem, Variation } from "../customer/shopping/cart/actions";

interface CartState {
  cartItems: CartItem[];
  totalCost: number;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cartItems: [],
  totalCost: 0,
  loading: false,
  error: null,
};

// Async thunk to fetch cart from server
export const fetchCart = createAsyncThunk("cart/fetchCart", async () => {
  const response = await axios.get("/api/cart"); // Adjust API endpoint as necessary
  return response.data; // Expecting { cartItems, totalCost }
});

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    increment: (state, action: PayloadAction<Variation>) => {
      const existingItem = state.cartItems.find(
        item => item.variation.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({
          id: Date.now(), // Generate a unique ID
          variation: action.payload,
          quantity: 1,
        });
      }
    },
    decrement: (state, action: PayloadAction<Variation>) => {
      const existingItem = state.cartItems.find(
        item => item.variation.id === action.payload.id
      );

      if (existingItem) {
        existingItem.quantity -= 1;
        if (existingItem.quantity <= 0) {
          state.cartItems = state.cartItems.filter(
            item => item.variation.id !== action.payload.id
          );
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchCart.pending, state => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload.cartItems;
        state.totalCost = action.payload.totalCost;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      });
  },
});

export const { increment, decrement } = cartSlice.actions;
export default cartSlice.reducer;
