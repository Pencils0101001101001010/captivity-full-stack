import { create } from "zustand";
import { Cart, CartItem, Variation, Product } from "@prisma/client";
import {
  addToCart as addToCartAction,
  updateCartItemQuantity as updateCartItemQuantityAction,
  removeFromCart as removeFromCartAction,
  fetchCart as fetchCartAction,
  clearCart as clearCartAction,
} from "../shopping/cart/actions";

type CartWithItems = Cart & {
  cartItems: (CartItem & {
    variation: Variation & {
      product: Product;
    };
  })[];
};

interface CartStore {
  cart: CartWithItems | null;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (variationId: string, quantity: number) => Promise<void>;
  updateCartItemQuantity: (
    cartItemId: string,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const useCartStore = create<CartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await fetchCartAction();
      if (result.success) {
        set({ cart: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch cart", isLoading: false });
    }
  },

  addToCart: async (variationId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await addToCartAction(variationId, quantity);
      if (result.success) {
        set({ cart: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to add item to cart", isLoading: false });
    }
  },

  updateCartItemQuantity: async (cartItemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateCartItemQuantityAction(cartItemId, quantity);
      if (result.success) {
        set({ cart: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to update cart item quantity", isLoading: false });
    }
  },

  removeFromCart: async (cartItemId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await removeFromCartAction(cartItemId);
      if (result.success) {
        set({ cart: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to remove item from cart", isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await clearCartAction();
      if (result.success) {
        set({ cart: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to clear cart", isLoading: false });
    }
  },
}));

export default useCartStore;
