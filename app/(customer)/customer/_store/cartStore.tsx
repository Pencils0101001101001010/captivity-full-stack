import { create } from "zustand";
import {
  AddToCartResult,
  CartItem,
  Variation,
  FetchCartResult,
  UpdateCartItemQuantityResult,
  DeleteCartItemResult,
} from "../shopping/cart/types";
import {
  fetchCart as fetchCartAction,
  addToCart as addToCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  deleteCartItem as deleteCartItemAction,
} from "../shopping/cart/actions";

interface CartStore {
  cartItems: CartItem[];
  totalCost: number;
  isFetching: boolean;
  isUpdating: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchCart: () => Promise<void>;
  addToCart: (
    variationId: number,
    quantity: number
  ) => Promise<AddToCartResult>;
  addToCartAndUpdate: (
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
  isFetching: false,
  isUpdating: false,
  error: null,
  lastFetched: null,

  shouldFetchCart: () => {
    const { lastFetched } = get();
    if (lastFetched === null) return true;
    return Date.now() - lastFetched > CACHE_TIME;
  },

  fetchCart: async () => {
    if (!get().shouldFetchCart()) return;

    set({ isFetching: true, error: null });
    const result = await fetchCartAction();
    if (result.success) {
      set({
        cartItems: result.data.cartItems,
        totalCost: result.data.totalCost,
        isFetching: false,
        lastFetched: Date.now(),
      });
    } else {
      set({ error: result.error, isFetching: false });
    }
  },

  addToCart: async (variationId: number, quantity: number) => {
    set({ isUpdating: true, error: null });
    const result = await addToCartAction(variationId, quantity);
    set({ isUpdating: false });
    return result;
  },

  addToCartAndUpdate: async (variation: Variation, quantity: number) => {
    set(state => ({
      ...state,
      isUpdating: true,
      error: null,
      cartItems: [
        ...state.cartItems,
        { id: Date.now(), variation, quantity } as CartItem,
      ],
      totalCost: state.totalCost + variation.product.sellingPrice * quantity,
    }));

    const result = await addToCartAction(variation.id, quantity);

    if (result.success) {
      await get().fetchCart(); // Sync with server
    } else {
      // Revert the optimistic update
      set(state => ({
        ...state,
        isUpdating: false,
        error: result.error,
        cartItems: state.cartItems.filter(
          item => item.variation.id !== variation.id
        ),
        totalCost: state.cartItems.reduce(
          (sum, item) =>
            sum + item.variation.product.sellingPrice * item.quantity,
          0
        ),
      }));
    }

    return result;
  },

  updateCartItemQuantity: async (cartItemId: number, newQuantity: number) => {
    set({ isUpdating: true, error: null });
    const result = await updateCartItemQuantityAction(cartItemId, newQuantity);
    if (result.success) {
      set(state => ({
        ...state,
        isUpdating: false,
        cartItems: state.cartItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: result.newQuantity }
            : item
        ),
        totalCost: result.newTotalCost,
        lastFetched: Date.now(),
      }));
    } else {
      set({ error: result.error, isUpdating: false });
    }
  },

  deleteCartItem: async (cartItemId: number) => {
    set({ isUpdating: true, error: null });
    const result = await deleteCartItemAction(cartItemId);
    if (result.success) {
      set(state => ({
        ...state,
        isUpdating: false,
        cartItems: state.cartItems.filter(item => item.id !== cartItemId),
        totalCost: state.cartItems.reduce(
          (sum, item) =>
            sum + item.variation.product.sellingPrice * item.quantity,
          0
        ),
        lastFetched: Date.now(),
      }));
    } else {
      set({ error: result.error, isUpdating: false });
    }
  },
}));
