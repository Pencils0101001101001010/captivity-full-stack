import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchSportCollection } from "../shopping/product_categories/sport/actions";

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

export type Category =
  "sport-collection";
  // | "men"
  // | "women"
  // | "kids"
  // | "hats"
  // | "golfers"
  // | "bottoms"
  // | "caps"
  // | "pre-curved-peaks"
  // | "uncategorised";

export type CategorizedProducts = Record<Category, ProductWithRelations[]>;


interface SportState {
  sportProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
}

interface SportActions {
  setSportProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSportCollection: () => Promise<void>;
}

const initialState: SportState = {
  sportProducts: {
    "sport-collection": [],
    // men: [],
    // women: [],
    // kids: [],
    // hats: [],
    // golfers: [],
    // bottoms: [],
    // caps: [],
    // "pre-curved-peaks": [],
    // uncategorised: [],
  },
  filteredProducts: {
    "sport-collection": [],
    // men: [],
    // women: [],
    // kids: [],
    // hats: [],
    // golfers: [],
    // bottoms: [],
    // caps: [],
    // "pre-curved-peaks": [],
    // uncategorised: [],
  },
  searchQuery: "",
  loading: false,
  error: null,
  hasInitiallyFetched: false,
  isInitializing: false,
};

let fetchPromise: Promise<void> | null = null;

const useSportStore = create<SportState & SportActions>()((set, get) => ({
  ...initialState,

  setSportProducts: products =>
    set({ sportProducts: products, filteredProducts: products }),

  setFilteredProducts: products => set({ filteredProducts: products }),

  setSearchQuery: query => {
    const { sportProducts } = get();
    set({ searchQuery: query });

    if (!query.trim()) {
      set({ filteredProducts: sportProducts });
      return;
    }

    const lowercaseQuery = query.toLowerCase().trim();

    // Create a new filtered products object with all categories// Create a new filtered products object with all categories
    const filtered: CategorizedProducts = Object.keys(sportProducts).reduce(
      (acc, category) => {
        const categoryProducts = sportProducts[category as Category];
        const filteredCategoryProducts = categoryProducts.filter(
          product =>
          [
             product.productName.toLowerCase(),
            product.description?.toLowerCase() || "",
            ...product.variations.map(v =>
              v.name.toLowerCase()),
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

  fetchSportCollection: async () => {
    const { loading, hasInitiallyFetched, isInitializing } = get();

    if (loading || hasInitiallyFetched || isInitializing) {
      return;
    }

    if (fetchPromise) {
      return fetchPromise;
    }

    set({ loading: true, error: null, isInitializing: true });

    fetchPromise = fetchSportCollection()
      .then(result => {
        if (result.success) {
          set({
            sportProducts: result.data as CategorizedProducts,
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

export const useSportProducts = () =>
  useSportStore(
    useShallow(state => ({
      products: state.filteredProducts,
      hasInitiallyFetched: state.hasInitiallyFetched,
    }))
  );

export const useSportLoading = () => useSportStore(state => state.loading);

export const useSportError = () => useSportStore(state => state.error);

export const useSportActions = () =>
  useSportStore(
    useShallow(state => ({
      setSportProducts: state.setSportProducts,
      setSearchQuery: state.setSearchQuery,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchSportCollection: state.fetchSportCollection,
    }))
  );

export default useSportStore;