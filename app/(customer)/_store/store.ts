import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import productsReducer from "./features/productsSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer, // Add your products slice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
