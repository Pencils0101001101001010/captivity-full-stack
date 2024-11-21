"use client";

import { create } from "zustand";
import {
  addToVendorCart as addToVendorCartAction,
  updateVendorCartItemQuantity as updateVendorCartItemQuantityAction,
  removeFromVendorCart as removeFromVendorCartAction,
  fetchVendorCart as fetchVendorCartAction,
  clearVendorCart as clearVendorCartAction,
} from "./actions";
import { VendorCart } from "../checkout/_lib/types";

interface VendorCartState {
  cart: VendorCart | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

interface VendorCartActions {
  fetchCart: () => Promise<void>;
  addToCart: (variationId: string, quantity: number) => Promise<void>;
  updateCartItemQuantity: (
    cartItemId: string,
    quantity: number
  ) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  setCart: (cart: VendorCart | null) => void;
}

interface VendorCartSelectors {
  totalItems: number;
  subtotal: number;
  isEmpty: boolean;
}

type VendorCartStore = VendorCartState &
  VendorCartActions &
  VendorCartSelectors;

// Calculate derived values outside of the store
const calculateTotalItems = (cart: VendorCart | null): number => {
  return (
    cart?.vendorCartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
  );
};

const calculateSubtotal = (cart: VendorCart | null): number => {
  if (!cart?.vendorCartItems) return 0;

  return cart.vendorCartItems.reduce((sum, item) => {
    const basePrice = item.vendorVariation.vendorProduct.sellingPrice;
    const dynamicPricing = item.vendorVariation.vendorProduct.dynamicPricing;

    if (!dynamicPricing?.length) return sum + basePrice * item.quantity;

    const applicableRule = dynamicPricing.find(rule => {
      const from = parseInt(rule.from);
      const to = parseInt(rule.to);
      return item.quantity >= from && item.quantity <= to;
    });

    if (!applicableRule) return sum + basePrice * item.quantity;

    if (applicableRule.type === "fixed_price") {
      return sum + parseFloat(applicableRule.amount) * item.quantity;
    } else {
      const discount = parseFloat(applicableRule.amount) / 100;
      return sum + basePrice * item.quantity * (1 - discount);
    }
  }, 0);
};

const isCartEmpty = (cart: VendorCart | null): boolean => {
  return !cart?.vendorCartItems?.length;
};

const useVendorCartStore = create<VendorCartStore>((set, get) => ({
  // Initial state
  cart: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Actions
  setCart: cart => {
    set({ cart });
  },

  fetchCart: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await fetchVendorCartAction();
      if (result.success) {
        set({
          cart: result.data as VendorCart,
          isLoading: false,
          isInitialized: true,
        });
      } else {
        set({
          error: result.error,
          isLoading: false,
          isInitialized: true,
        });
      }
    } catch (error) {
      set({
        error: "Failed to fetch vendor cart",
        isLoading: false,
        isInitialized: true,
      });
    }
  },

  addToCart: async (variationId: string, quantity: number) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await addToVendorCartAction(variationId, quantity);
      if (result.success) {
        set({ cart: result.data as VendorCart, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to add item to vendor cart", isLoading: false });
    }
  },

  updateCartItemQuantity: async (cartItemId: string, quantity: number) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await updateVendorCartItemQuantityAction(
        cartItemId,
        quantity
      );
      if (result.success) {
        set({ cart: result.data as VendorCart, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({
        error: "Failed to update vendor cart item quantity",
        isLoading: false,
      });
    }
  },

  removeFromCart: async (cartItemId: string) => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await removeFromVendorCartAction(cartItemId);
      if (result.success) {
        set({ cart: result.data as VendorCart, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({
        error: "Failed to remove item from vendor cart",
        isLoading: false,
      });
    }
  },

  clearCart: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await clearVendorCartAction();
      if (result.success) {
        set({ cart: result.data as VendorCart, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to clear vendor cart", isLoading: false });
    }
  },

  // Computed values (selectors)
  get totalItems() {
    return calculateTotalItems(get().cart);
  },

  get subtotal() {
    return calculateSubtotal(get().cart);
  },

  get isEmpty() {
    return isCartEmpty(get().cart);
  },
}));

export default useVendorCartStore;
