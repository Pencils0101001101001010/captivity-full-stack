// store/cartStore.ts
import { create } from "zustand";
import { AddToCartResult, CartItem, Variation } from "../shopping/cart/types";
import {
  fetchCart as fetchCartAction,
  addToCart as addToCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  deleteCartItem as deleteCartItemAction,
} from "../shopping/cart/actions";

interface CartStore {
  cartItems: CartItem[];
  totalCost: number;
  isLoading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchCart: () => Promise<void>;
  addToCart: (
    variation: Variation,
    quantity: number
  ) => Promise<AddToCartResult>;
  updateCartItemQuantity: (
    cartItemId: number,
    newQuantity: number
  ) => Promise<void>;
  deleteCartItem: (cartItemId: number) => Promise<void>;
  shouldFetchCart: () => boolean;
}

const CACHE_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useCartStore = create<CartStore>((set, get) => ({
  cartItems: [],
  totalCost: 0,
  isLoading: false,
  error: null,
  lastFetched: null,

  shouldFetchCart: () => {
    const { lastFetched } = get();
    if (lastFetched === null) return true;
    return Date.now() - lastFetched > CACHE_TIME;
  },

  fetchCart: async () => {
    if (!get().shouldFetchCart()) return;

    set({ isLoading: true, error: null });
    const result = await fetchCartAction();
    if (result.success) {
      set({
        cartItems: result.data.cartItems,
        totalCost: result.data.totalCost,
        isLoading: false,
        lastFetched: Date.now(),
      });
    } else {
      set({ error: result.error, isLoading: false });
    }
  },

  addToCart: async (variation: Variation, quantity: number) => {
    set({ isLoading: true, error: null });
    const result = await addToCartAction(variation.id, quantity);
    if (result.success) {
      await get().fetchCart();
    } else {
      set({ error: result.error, isLoading: false });
    }
    return result;
  },

  updateCartItemQuantity: async (cartItemId: number, newQuantity: number) => {
    set({ isLoading: true, error: null });
    const result = await updateCartItemQuantityAction(cartItemId, newQuantity);
    if (result.success) {
      set(state => {
        const updatedCartItems = state.cartItems.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        );
        return {
          cartItems: updatedCartItems,
          totalCost: result.newTotalCost,
          isLoading: false,
          lastFetched: Date.now(),
        };
      });
    } else {
      set({ error: result.error, isLoading: false });
    }
  },

  deleteCartItem: async (cartItemId: number) => {
    set({ isLoading: true, error: null });
    const result = await deleteCartItemAction(cartItemId);
    if (result.success) {
      set(state => {
        const updatedCartItems = state.cartItems.filter(
          item => item.id !== cartItemId
        );
        const newTotalCost = updatedCartItems.reduce(
          (sum, item) =>
            sum + item.variation.product.sellingPrice * item.quantity,
          0
        );
        return {
          cartItems: updatedCartItems,
          totalCost: newTotalCost,
          isLoading: false,
          lastFetched: Date.now(),
        };
      });
    } else {
      set({ error: result.error, isLoading: false });
    }
  },
}));
