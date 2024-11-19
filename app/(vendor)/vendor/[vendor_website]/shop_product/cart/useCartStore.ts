"use client";

import { create } from "zustand";
import {
  addToVendorCart as addToVendorCartAction,
  updateVendorCartItemQuantity as updateVendorCartItemQuantityAction,
  removeFromVendorCart as removeFromVendorCartAction,
  fetchVendorCart as fetchVendorCartAction,
  clearVendorCart as clearVendorCartAction,
} from "./actions";
import { VendorCart, VendorVariation, VendorProduct } from "@prisma/client";

type VendorProductWithDetails = VendorProduct & {
  featuredImage?: {
    medium: string;
  } | null;
  dynamicPricing: Array<{
    from: string;
    to: string;
    type: string;
    amount: string;
  }>;
};

type VendorCartItem = {
  id: string;
  vendorCartId: string;
  vendorVariationId: string;
  quantity: number;
  vendorVariation: VendorVariation & {
    vendorProduct: VendorProductWithDetails;
  };
};

type VendorCartWithItems = VendorCart & {
  vendorCartItems: VendorCartItem[];
};

interface VendorCartState {
  cart: VendorCartWithItems | null;
  isLoading: boolean;
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
  setCart: (cart: VendorCartWithItems | null) => void;
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
const calculateTotalItems = (cart: VendorCartWithItems | null): number => {
  return (
    cart?.vendorCartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0
  );
};

const calculateSubtotal = (cart: VendorCartWithItems | null): number => {
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

const isCartEmpty = (cart: VendorCartWithItems | null): boolean => {
  return !cart?.vendorCartItems?.length;
};

const useVendorCartStore = create<VendorCartStore>((set, get) => ({
  // Initial state
  cart: null,
  isLoading: false,
  error: null,

  // Actions
  setCart: cart => {
    set({ cart });
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await fetchVendorCartAction();
      if (result.success) {
        set({ cart: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch vendor cart", isLoading: false });
    }
  },

  addToCart: async (variationId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await addToVendorCartAction(variationId, quantity);
      if (result.success) {
        set({ cart: result.data, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to add item to vendor cart", isLoading: false });
    }
  },

  updateCartItemQuantity: async (cartItemId: string, quantity: number) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateVendorCartItemQuantityAction(
        cartItemId,
        quantity
      );
      if (result.success) {
        set({ cart: result.data, isLoading: false });
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
    set({ isLoading: true, error: null });
    try {
      const result = await removeFromVendorCartAction(cartItemId);
      if (result.success) {
        set({ cart: result.data, isLoading: false });
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
    set({ isLoading: true, error: null });
    try {
      const result = await clearVendorCartAction();
      if (result.success) {
        set({ cart: result.data, isLoading: false });
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
