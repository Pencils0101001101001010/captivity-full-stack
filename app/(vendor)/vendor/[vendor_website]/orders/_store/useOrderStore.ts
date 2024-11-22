// app/(vendor)/vendor/[vendor_website]/stores/useVendorOrderStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  VendorFormValues,
  VendorOrder,
  VendorOrderActionResult,
} from "../../shop_product/checkout/_lib/types";
import {
  createVendorOrder,
  getVendorOrder,
  getVendorUserDetails,
} from "../../shop_product/checkout/actions";
import { subWeeks } from "date-fns";

export type PriceRange =
  | "less_than_twoK"
  | "two_to_fiveK"
  | "greater_than_fiveK";

interface OrderState {
  // Data
  currentOrder: VendorOrder | null;
  userDetails: any | null;
  loading: boolean;
  error: string | null;
  filteredOrders: VendorOrder[];
  selectedPriceRange: PriceRange | null;

  // Actions
  fetchOrder: (orderId?: string) => Promise<void>;
  fetchUserDetails: () => Promise<void>;
  createOrder: (formData: VendorFormValues) => Promise<VendorOrderActionResult>;
  clearOrder: () => void;
  setError: (error: string | null) => void;
  filterByPriceRange: (range: PriceRange) => void;
  getOrdersByAge: () => {
    recentOrders: VendorOrder[];
    oldOrders: VendorOrder[];
  };
}

const useVendorOrderStore = create<OrderState>()(
  devtools((set, get) => ({
    // Initial state
    currentOrder: null,
    userDetails: null,
    loading: false,
    error: null,
    filteredOrders: [],
    selectedPriceRange: null,

    filterByPriceRange: (range: PriceRange) => {
      const currentOrder = get().currentOrder;
      if (!currentOrder) return;

      const orders = Array.isArray(currentOrder)
        ? currentOrder
        : [currentOrder];
      let filtered: VendorOrder[] = [];

      switch (range) {
        case "less_than_twoK":
          filtered = orders.filter(order => order.totalAmount < 2000);
          break;
        case "two_to_fiveK":
          filtered = orders.filter(
            order => order.totalAmount >= 2000 && order.totalAmount <= 5000
          );
          break;
        case "greater_than_fiveK":
          filtered = orders.filter(order => order.totalAmount > 5000);
          break;
      }

      set({
        filteredOrders: filtered,
        selectedPriceRange: range,
      });
    },

    getOrdersByAge: () => {
      const currentOrder = get().currentOrder;
      if (!currentOrder) return { recentOrders: [], oldOrders: [] };

      const orders = Array.isArray(currentOrder)
        ? currentOrder
        : [currentOrder];
      const oneWeekAgo = subWeeks(new Date(), 1);

      return {
        recentOrders: orders.filter(
          order => new Date(order.createdAt) > oneWeekAgo
        ),
        oldOrders: orders.filter(
          order => new Date(order.createdAt) <= oneWeekAgo
        ),
      };
    },

    fetchOrder: async (orderId?: string) => {
      try {
        set({ loading: true, error: null });
        const response = await getVendorOrder(orderId);

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch order");
        }

        const orderData = Array.isArray(response.data)
          ? response.data
          : [response.data];

        set({
          currentOrder: response.data,
          filteredOrders: orderData,
          loading: false,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
        });
      }
    },

    fetchUserDetails: async () => {
      try {
        set({ loading: true, error: null });
        const response = await getVendorUserDetails();

        if (!response.success) {
          throw new Error(response.error || "Failed to fetch user details");
        }

        set({
          userDetails: response.data,
          loading: false,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
        });
      }
    },

    createOrder: async (formData: VendorFormValues) => {
      try {
        set({ loading: true, error: null });
        const response = await createVendorOrder(formData);

        if (!response.success) {
          throw new Error(response.error || "Failed to create order");
        }

        set({
          currentOrder: response.data,
          loading: false,
        });

        return response;
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
        });
        return {
          success: false,
          message: "Failed to create order",
          error: error instanceof Error ? error.message : "An error occurred",
        };
      }
    },

    clearOrder: () => {
      set({
        currentOrder: null,
        filteredOrders: [],
        selectedPriceRange: null,
        error: null,
      });
    },

    setError: (error: string | null) => {
      set({ error });
    },
  }))
);

export default useVendorOrderStore;
