import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchSummerCollection } from "../shopping/(product_categories)/summer/actions";

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

export type Category =
  | "men"
  | "women"
  | "kids"
  | "hats"
  | "golfers"
  | "bottoms"
  | "caps"
  | "uncategorised";

export type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

interface SummerState {
  summerProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

interface SummerActions {
  setSummerProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSummerCollection: () => Promise<void>;
  filterProducts: (query: string) => void;
}

const initialState: SummerState = {
  summerProducts: {
    men: [],
    women: [],
    kids: [],
    hats: [],
    golfers: [],
    bottoms: [],
    caps: [],
    uncategorised: [],
  },
  filteredProducts: {
    men: [],
    women: [],
    kids: [],
    hats: [],
    golfers: [],
    bottoms: [],
    caps: [],
    uncategorised: [],
  },
  searchQuery: "",
  loading: false,
  error: null,
};

const useSummerStore = create<SummerState & SummerActions>()((set, get) => ({
  ...initialState,

  setSummerProducts: products =>
    set({ summerProducts: products, filteredProducts: products }),

  setFilteredProducts: products => set({ filteredProducts: products }),

  setSearchQuery: query => {
    set({ searchQuery: query });
    get().filterProducts(query);
  },

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  filterProducts: query => {
    const { summerProducts } = get();
    const lowercaseQuery = query.toLowerCase().trim();

    if (!lowercaseQuery) {
      set({ filteredProducts: summerProducts });
      return;
    }

    const filtered = Object.entries(summerProducts).reduce(
      (acc, [category, products]) => {
        const filteredProducts = products.filter(
          product =>
            product.productName.toLowerCase().includes(lowercaseQuery) ||
            product.description?.toLowerCase().includes(lowercaseQuery) ||
            product.variations.some(variation =>
              variation.name.toLowerCase().includes(lowercaseQuery)
            )
        );

        return {
          ...acc,
          [category]: filteredProducts,
        };
      },
      {} as CategorizedProducts
    );

    set({ filteredProducts: filtered });
  },

  fetchSummerCollection: async () => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true, error: null });
    try {
      const result = await fetchSummerCollection();
      if (result.success) {
        set({
          summerProducts: result.data,
          filteredProducts: result.data,
          loading: false,
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },
}));

// Selector hooks
export const useSummerProducts = () =>
  useSummerStore(useShallow(state => state.filteredProducts));

export const useSummerLoading = () => useSummerStore(state => state.loading);

export const useSummerError = () => useSummerStore(state => state.error);

// Group actions together
export const useSummerActions = () =>
  useSummerStore(
    useShallow(state => ({
      setSummerProducts: state.setSummerProducts,
      setSearchQuery: state.setSearchQuery,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchSummerCollection: state.fetchSummerCollection,
    }))
  );

export default useSummerStore;
