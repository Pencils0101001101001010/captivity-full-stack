import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchFashionCollection } from "../shopping/product_categories/fashion/actions";

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
  | "trucker-caps"
  | "flat-peaks"
  | "uncategorised";

export type CategorizedProducts = Record<Category, ProductWithRelations[]>;

interface FashionState {
  fashionProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
}

interface FashionActions {
  setFashionProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchFashionCollection: () => Promise<void>;
}

const initialState: FashionState = {
  fashionProducts: {
    men: [],
    women: [],
    kids: [],
    hats: [],
    golfers: [],
    bottoms: [],
    caps: [],
    "trucker-caps": [],
    "flat-peaks": [],
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
    "trucker-caps": [],
    "flat-peaks": [],
    uncategorised: [],
  },
  searchQuery: "",
  loading: false,
  error: null,
  hasInitiallyFetched: false,
  isInitializing: false,
};

let fetchPromise: Promise<void> | null = null;

const useFashionStore = create<FashionState & FashionActions>()((set, get) => ({
  ...initialState,

  setFashionProducts: products =>
    set({ fashionProducts: products, filteredProducts: products }),

  setFilteredProducts: products => set({ filteredProducts: products }),

  setSearchQuery: query => {
    const { fashionProducts } = get();
    set({ searchQuery: query });

    if (!query.trim()) {
      set({ filteredProducts: fashionProducts });
      return;
    }

    const lowercaseQuery = query.toLowerCase().trim();

    // Create a new filtered products object with all categories
    const filtered: CategorizedProducts = Object.keys(fashionProducts).reduce(
      (acc, category) => {
        const categoryProducts = fashionProducts[category as Category];
        const filteredCategoryProducts = categoryProducts.filter(product =>
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

  fetchFashionCollection: async () => {
    const { loading, hasInitiallyFetched, isInitializing } = get();

    if (loading || hasInitiallyFetched || isInitializing) {
      return;
    }

    if (fetchPromise) {
      return fetchPromise;
    }

    set({ loading: true, error: null, isInitializing: true });

    fetchPromise = fetchFashionCollection()
      .then(result => {
        if (result.success) {
          set({
            fashionProducts: result.data as CategorizedProducts,
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

export const useFashionProducts = () =>
  useFashionStore(
    useShallow(state => ({
      products: state.filteredProducts,
      hasInitiallyFetched: state.hasInitiallyFetched,
    }))
  );

export const useFashionLoading = () => useFashionStore(state => state.loading);

export const useFashionError = () => useFashionStore(state => state.error);

export const useFashionActions = () =>
  useFashionStore(
    useShallow(state => ({
      setFashionProducts: state.setFashionProducts,
      setSearchQuery: state.setSearchQuery,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchFashionCollection: state.fetchFashionCollection,
    }))
  );

export default useFashionStore;
