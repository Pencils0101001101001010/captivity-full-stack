import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchLeisureCollection } from "../shopping/product_categories/leisure/actions";

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

// Match the API's category types
export type Category =
  | "men"
  | "women"
  | "kids"
  | "hats"
  | "golfers"
  | "bottoms"
  | "caps"
  | "uncategorised";

// Match the API's categorized products type
export type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

// Match the API's response type
export type FetchLeisureCollectionResult =
  | { success: true; data: CategorizedProducts }
  | { success: false; error: string };

interface LeisureState {
  leisureProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
}

interface LeisureActions {
  setLeisureProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchLeisureCollection: () => Promise<void>;
}

const initialState: LeisureState = {
  leisureProducts: {
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
  hasInitiallyFetched: false,
  isInitializing: false,
};

let fetchPromise: Promise<void> | null = null;

const useLeisureStore = create<LeisureState & LeisureActions>()((set, get) => ({
  ...initialState,

  setLeisureProducts: products =>
    set({ leisureProducts: products, filteredProducts: products }),

  setFilteredProducts: products => set({ filteredProducts: products }),

  setSearchQuery: query => {
    const { leisureProducts } = get();
    set({ searchQuery: query });

    if (!query.trim()) {
      set({ filteredProducts: leisureProducts });
      return;
    }

    const lowercaseQuery = query.toLowerCase().trim();
    const filtered: CategorizedProducts = Object.fromEntries(
      Object.entries(leisureProducts).map(([category, products]) => [
        category,
        products.filter(product =>
          [
            product.productName.toLowerCase(),
            product.description?.toLowerCase() || "",
            ...product.variations.map(v => v.name.toLowerCase()),
            ...product.category.map(c => c.toLowerCase()),
          ].some(text => text.includes(lowercaseQuery))
        ),
      ])
    ) as CategorizedProducts;

    set({ filteredProducts: filtered });
  },

  setLoading: loading => set({ loading }),

  setError: error => set({ error }),

  fetchLeisureCollection: async () => {
    const { loading, hasInitiallyFetched, isInitializing } = get();

    if (loading || hasInitiallyFetched || isInitializing) {
      return;
    }

    if (fetchPromise) {
      return fetchPromise;
    }

    set({ loading: true, error: null, isInitializing: true });

    fetchPromise = fetchLeisureCollection()
      .then((result: FetchLeisureCollectionResult) => {
        if (result.success) {
          set({
            leisureProducts: result.data,
            filteredProducts: result.data,
            loading: false,
            hasInitiallyFetched: true,
            isInitializing: false,
          });
        } else {
          throw new Error(result.error);
        }
      })
      .catch(error => {
        set({
          error: (error as Error).message,
          loading: false,
          hasInitiallyFetched: true,
          isInitializing: false,
        });
      })
      .finally(() => {
        fetchPromise = null;
      });

    return fetchPromise;
  },
}));

// Selector hooks with proper typing
export const useLeisureProducts = () =>
  useLeisureStore(
    useShallow(state => ({
      products: state.filteredProducts,
      hasInitiallyFetched: state.hasInitiallyFetched,
    }))
  );

export const useLeisureLoading = () => useLeisureStore(state => state.loading);

export const useLeisureError = () => useLeisureStore(state => state.error);

export const useLeisureActions = () =>
  useLeisureStore(
    useShallow(state => ({
      setLeisureProducts: state.setLeisureProducts,
      setSearchQuery: state.setSearchQuery,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchLeisureCollection: state.fetchLeisureCollection,
    }))
  );

export default useLeisureStore;
