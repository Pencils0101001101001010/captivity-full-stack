import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchIndustrialCollection } from "../shopping/product_categories/industrial/actions";

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

export type Category = "industrial-collection";

export type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

interface IndustrialState {
  industrialProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
}

interface IndustrialActions {
  setIndustrialProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchIndustrialCollection: () => Promise<void>;
}

const initialState: IndustrialState = {
  industrialProducts: {
    "industrial-collection": [],
  },
  filteredProducts: {
    "industrial-collection": [],
  },
  searchQuery: "",
  loading: false,
  error: null,
  hasInitiallyFetched: false,
  isInitializing: false,
};

let fetchPromise: Promise<void> | null = null;

const useIndustrialStore = create<IndustrialState & IndustrialActions>()(
  (set, get) => ({
    ...initialState,

    setIndustrialProducts: products =>
      set({ industrialProducts: products, filteredProducts: products }),

    setFilteredProducts: products => set({ filteredProducts: products }),

    setSearchQuery: query => {
      const { industrialProducts } = get();
      set({ searchQuery: query });

      if (!query.trim()) {
        set({ filteredProducts: industrialProducts });
        return;
      }

      const lowercaseQuery = query.toLowerCase().trim();
      const filtered = Object.entries(industrialProducts).reduce(
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

    setLoading: loading => set({ loading }),

    setError: error => set({ error }),

    fetchIndustrialCollection: async () => {
      const { loading, hasInitiallyFetched, isInitializing } = get();

      if (loading || hasInitiallyFetched || isInitializing) {
        return;
      }

      if (fetchPromise) {
        return fetchPromise;
      }

      set({ loading: true, error: null, isInitializing: true });

      fetchPromise = fetchIndustrialCollection()
        .then(result => {
          if (result.success) {
            set({
              industrialProducts: result.data,
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
  })
);

export const useIndustrialProducts = () =>
  useIndustrialStore(
    useShallow(state => ({
      products: state.filteredProducts,
      hasInitiallyFetched: state.hasInitiallyFetched,
    }))
  );

export const useIndustrialLoading = () =>
  useIndustrialStore(state => state.loading);

export const useIndustrialError = () =>
  useIndustrialStore(state => state.error);

export const useIndustrialActions = () =>
  useIndustrialStore(
    useShallow(state => ({
      setIndustrialProducts: state.setIndustrialProducts,
      setSearchQuery: state.setSearchQuery,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchIndustrialCollection: state.fetchIndustrialCollection,
    }))
  );

export default useIndustrialStore;
