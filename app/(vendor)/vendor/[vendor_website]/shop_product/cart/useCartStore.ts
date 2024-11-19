import { create } from "zustand";
import {
  addToVendorCart as addToVendorCartAction,
  updateVendorCartItemQuantity as updateVendorCartItemQuantityAction,
  removeFromVendorCart as removeFromVendorCartAction,
  fetchVendorCart as fetchVendorCartAction,
  clearVendorCart as clearVendorCartAction,
} from "./actions";
import { Cart, VendorVariation, VendorProduct } from "@prisma/client";

// Define the extended types
type VendorProductWithImage = VendorProduct & {
  featuredImage?: {
    medium: string;
  };
};

type VendorCartItem = {
  id: string;
  cartId: string;
  variationId: string;
  quantity: number;
  variation: VendorVariation & {
    vendorProduct: VendorProductWithImage;
  };
};

type VendorCartWithItems = Cart & {
  cartItems: VendorCartItem[];
};

interface VendorCartStore {
  cart: VendorCartWithItems | null;
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
  setCart: (cart: VendorCartWithItems | null) => void;

  // Additional vendor-specific computed properties
  totalItems: number;
  subtotal: number;
  isEmpty: boolean;
}

const useVendorCartStore = create<VendorCartStore>((set, get) => ({
  cart: null,
  isLoading: false,
  error: null,

  setCart: cart => {
    set({ cart });
  },

  fetchCart: async () => {
    const currentCart = get().cart;
    if (currentCart?.cartItems.length === 0) {
      return;
    }

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

  // Computed properties
  get totalItems() {
    return (
      get().cart?.cartItems.reduce((sum, item) => sum + item.quantity, 0) || 0
    );
  },

  get subtotal() {
    return (
      get().cart?.cartItems.reduce((sum, item) => {
        const price = item.variation.vendorProduct.sellingPrice;
        return sum + price * item.quantity;
      }, 0) || 0
    );
  },

  get isEmpty() {
    return !get().cart?.cartItems.length;
  },
}));

export default useVendorCartStore;
