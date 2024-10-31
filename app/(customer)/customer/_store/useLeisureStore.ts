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

export type Category = "leisure-collection";

export type CategorizedProducts = Record<Category, ProductWithRelations[]>;


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
    "leisure-collection": [],    // men: [],
    // women: [],
    // kids: [],
    // hats: [],
    // golfers: [],
    // bottoms: [],
    // caps: [],
    // "bucket-hats": [],
    // uncategorised: [],
  },
  filteredProducts: {
    "leisure-collection": [],
    // men: [],
    // women: [],
    // kids: [],
    // hats: [],
    // golfers: [],
    // bottoms: [],
    // caps: [],
    // "bucket-hats": [],
    // uncategorised: [],
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
    const filtered: CategorizedProducts = Object.keys(leisureProducts).reduce(
      (acc, category) => {
        const categoryProducts = leisureProducts[category as Category];
        const filteredCategoryProducts = categoryProducts.filter(
          product =>
          [
            product.productName.toLowerCase(),
            product.description?.toLowerCase() || "",
            ...product.variations.map(v => v.name.toLowerCase()),
            ...product.category.map(c => c.toLowerCase()),
          ].some(text => text.includes(lowercaseQuery))
        );

        return {
          ...acc,
          [category]: filteredCategoryProducts,
        };
      },
      {} as CategorizedProducts
    );

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
      .then(result => {
        if (result.success) {
          set({
            leisureProducts: result.data as CategorizedProducts,
            filteredProducts: result.data as CategorizedProducts,
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
