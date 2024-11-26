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
import { OrderStatus } from "@prisma/client";

export type PriceRange =
  | "less_than_twoK"
  | "two_to_fiveK"
  | "greater_than_fiveK";
export type TimeFilter = "all" | "recent" | "old";
export type StatusFilter = OrderStatus | "all";
export type CustomerTypeFilter = "all" | "vendor" | "customer";
export type SortDirection = "asc" | "desc";
export type SortField = "date" | "amount" | "status";

interface OrderState {
  currentOrders: (VendorOrder & {
    user?: { role: string; storeSlug: string | null };
  })[];
  filteredOrders: (VendorOrder & {
    user?: { role: string; storeSlug: string | null };
  })[];
  loading: boolean;
  error: string | null;
  selectedPriceRange: PriceRange;
  selectedTimeFilter: TimeFilter;
  selectedStatus: StatusFilter;
  selectedCustomerType: CustomerTypeFilter;
  sortDirection: SortDirection;
  sortField: SortField;
  searchQuery: string;
  totalOrders: number;
  totalAmount: number;
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;

  fetchOrders: () => Promise<void>;
  filterOrders: (
    priceRange?: PriceRange,
    timeFilter?: TimeFilter,
    status?: StatusFilter,
    customerType?: CustomerTypeFilter
  ) => void;
  sortOrders: (field: SortField, direction: SortDirection) => void;
  searchOrders: (query: string) => void;
  setPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  getOrdersByAge: () => {
    recentOrders: VendorOrder[];
    oldOrders: VendorOrder[];
  };
  getOrderStats: () => {
    pending: number;
    processing: number;
    completed: number;
    totalAmount: number;
  };
}

const useVendorOrderStore = create<OrderState>()(
  devtools((set, get) => ({
    currentOrders: [],
    filteredOrders: [],
    loading: false,
    error: null,
    selectedPriceRange: "less_than_twoK",
    selectedTimeFilter: "all",
    selectedStatus: "all",
    selectedCustomerType: "all",
    sortDirection: "desc",
    sortField: "date",
    searchQuery: "",
    totalOrders: 0,
    totalAmount: 0,
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,

    fetchOrders: async () => {
      try {
        set({ loading: true, error: null });
        const response = await getVendorOrder();

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to fetch orders");
        }

        const orders = Array.isArray(response.data)
          ? response.data
          : [response.data];

        set(state => ({
          ...state,
          currentOrders: orders,
          loading: false,
        }));

        const {
          filterOrders,
          selectedPriceRange,
          selectedTimeFilter,
          selectedStatus,
          selectedCustomerType,
        } = get();
        filterOrders(
          selectedPriceRange,
          selectedTimeFilter,
          selectedStatus,
          selectedCustomerType
        );
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "An error occurred",
          loading: false,
          currentOrders: [],
          filteredOrders: [],
        });
      }
    },

    filterOrders: (
      priceRange?: PriceRange,
      timeFilter?: TimeFilter,
      status?: StatusFilter,
      customerType?: CustomerTypeFilter
    ) => {
      const state = get();
      let filtered = [...state.currentOrders];

      // Apply customer type filter
      if (customerType && customerType !== "all") {
        filtered = filtered.filter(order => {
          if (customerType === "vendor") {
            return !order.user?.storeSlug?.includes("-customer-");
          } else {
            return order.user?.storeSlug?.includes("-customer-");
          }
        });
      }

      // Apply time filter
      if (timeFilter && timeFilter !== "all") {
        const oneWeekAgo = subWeeks(new Date(), 1);
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.createdAt);
          return timeFilter === "recent"
            ? orderDate > oneWeekAgo
            : orderDate <= oneWeekAgo;
        });
      }

      // Apply price filter
      if (priceRange) {
        filtered = filtered.filter(order => {
          switch (priceRange) {
            case "less_than_twoK":
              return order.totalAmount < 2000;
            case "two_to_fiveK":
              return order.totalAmount >= 2000 && order.totalAmount <= 5000;
            case "greater_than_fiveK":
              return order.totalAmount > 5000;
          }
        });
      }

      // Apply status filter
      if (status && status !== "all") {
        filtered = filtered.filter(order => order.status === status);
      }

      // Apply search
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          order =>
            order.id.toLowerCase().includes(query) ||
            order.firstName.toLowerCase().includes(query) ||
            order.lastName.toLowerCase().includes(query) ||
            order.companyName.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        const direction = state.sortDirection === "asc" ? 1 : -1;
        switch (state.sortField) {
          case "date":
            return (
              direction *
              (new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime())
            );
          case "amount":
            return direction * (b.totalAmount - a.totalAmount);
          case "status":
            return direction * a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });

      // Update pagination
      const totalPages = Math.ceil(filtered.length / state.itemsPerPage);
      const start = (state.currentPage - 1) * state.itemsPerPage;
      const paginatedOrders = filtered.slice(start, start + state.itemsPerPage);

      set({
        filteredOrders: paginatedOrders,
        selectedPriceRange: priceRange || state.selectedPriceRange,
        selectedTimeFilter: timeFilter || state.selectedTimeFilter,
        selectedStatus: status || state.selectedStatus,
        selectedCustomerType: customerType || state.selectedCustomerType,
        totalOrders: filtered.length,
        totalAmount: filtered.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        ),
        totalPages,
      });
    },

    sortOrders: (field: SortField, direction: SortDirection) => {
      set({ sortField: field, sortDirection: direction });
      get().filterOrders();
    },

    searchOrders: (query: string) => {
      set({ searchQuery: query, currentPage: 1 });
      get().filterOrders();
    },

    setPage: (page: number) => {
      set({ currentPage: page });
      get().filterOrders();
    },

    setItemsPerPage: (items: number) => {
      set({ itemsPerPage: items, currentPage: 1 });
      get().filterOrders();
    },

    getOrdersByAge: () => {
      const { currentOrders } = get();
      const oneWeekAgo = subWeeks(new Date(), 1);

      return {
        recentOrders: currentOrders.filter(
          order => new Date(order.createdAt) > oneWeekAgo
        ),
        oldOrders: currentOrders.filter(
          order => new Date(order.createdAt) <= oneWeekAgo
        ),
      };
    },

    getOrderStats: () => {
      const { currentOrders } = get();
      return {
        pending: currentOrders.filter(o => o.status === "PENDING").length,
        processing: currentOrders.filter(o => o.status === "PROCESSING").length,
        completed: currentOrders.filter(o => o.status === "DELIVERED").length,
        totalAmount: currentOrders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        ),
      };
    },
  }))
);

export default useVendorOrderStore;