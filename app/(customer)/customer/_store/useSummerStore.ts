// store/useProductsStore.ts
import { create } from "zustand";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchSummerCollection } from "../shopping/summer/actions";

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

interface ProductsState {
  // State
  summerProducts: ProductWithRelations[];
  loading: boolean;
  error: string | null;

  // Actions
  setSummerProducts: (products: ProductWithRelations[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSummerCollection: () => Promise<void>;
}

const useProductsStore = create<ProductsState>()(set => ({
  // Initial state
  summerProducts: [],
  loading: false,
  error: null,

  // Actions
  setSummerProducts: products => set({ summerProducts: products }),

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  fetchSummerCollection: async () => {
    set({ loading: true, error: null });
    try {
      const result = await fetchSummerCollection();
      if (result.success) {
        set({ summerProducts: result.data });
      } else {
        set({ error: result.error });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductsStore;
