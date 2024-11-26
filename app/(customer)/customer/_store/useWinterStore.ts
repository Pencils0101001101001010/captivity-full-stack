import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchWinterCollection } from "../shopping/product_categories/winter/actions";

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

//sort by filter:
export type SortValue =
  | "relevance"
  | "code-asc"
  | "code-desc"
  | "name-asc"
  | "name-desc"
  | "stock-asc"
  | "stock-desc"
  | "price-asc"
  | "price-desc";

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

interface WinterState {
  winterProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
  sortBy: SortValue; // sort by
}

interface WinterActions {
  setWinterProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchWinterCollection: () => Promise<void>;
  setSortBy: (sortBy: SortValue) => void; //sort by
}

const initialState: WinterState = {
  winterProducts: {
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
  sortBy: "relevance", //sort by
};

let fetchPromise: Promise<void> | null = null;

const useWinterStore = create<WinterState & WinterActions>()((set, get) => ({
  ...initialState,

  setWinterProducts: products =>
    set({ winterProducts: products, filteredProducts: products }),

  setFilteredProducts: products => set({ filteredProducts: products }),

  setSearchQuery: query => {
    const { winterProducts } = get();
    set({ searchQuery: query });

    if (!query.trim()) {
      set({ filteredProducts: winterProducts });
      return;
    }

    const lowercaseQuery = query.toLowerCase().trim();
    const filtered = Object.entries(winterProducts).reduce(
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

  //sort by --------------------------------------------
  setSortBy: sortBy => {
    set({ sortBy });
    const { filteredProducts } = get();

    // First, combine all products into a single array
    const allProducts = Object.values(filteredProducts).flat().filter(Boolean);

    // Sort all products together
    let sortedProducts = [...allProducts];

    switch (sortBy) {
      case "code-asc":
        sortedProducts.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "code-desc":
        sortedProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "name-asc":
        sortedProducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case "name-desc":
        sortedProducts.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      case "stock-asc":
        sortedProducts.sort((a, b) => {
          const aStock = a.variations.reduce((sum, v) => sum + v.quantity, 0);
          const bStock = b.variations.reduce((sum, v) => sum + v.quantity, 0);
          return aStock - bStock;
        });
        break;
      case "stock-desc":
        sortedProducts.sort((a, b) => {
          const aStock = a.variations.reduce((sum, v) => sum + v.quantity, 0);
          const bStock = b.variations.reduce((sum, v) => sum + v.quantity, 0);
          return bStock - aStock;
        });
        break;
      case "price-asc":
        sortedProducts.sort(
          (a, b) => Number(a.sellingPrice) - Number(b.sellingPrice)
        );
        break;
      case "price-desc":
        sortedProducts.sort(
          (a, b) => Number(b.sellingPrice) - Number(a.sellingPrice)
        );
        break;
    }

    // Create new categorized products object
    const newSortedProducts: CategorizedProducts = {
      men: [],
      women: [],
      kids: [],
      hats: [],
      golfers: [],
      bottoms: [],
      caps: [],
      uncategorised: [],
    };

    // Distribute sorted products into categories
    sortedProducts.forEach(product => {
      const categories = product.category as string[];
      let categorized = false;

      (Object.keys(newSortedProducts) as Category[]).forEach(category => {
        if (
          categories.includes(category.toLowerCase()) ||
          (category === "uncategorised" && !categorized)
        ) {
          newSortedProducts[category].push(product);
          categorized = true;
        }
      });
    });

    set({ filteredProducts: newSortedProducts });
  },
  //---------------------------------------------------------------------------------

  fetchWinterCollection: async () => {
    const { loading, hasInitiallyFetched, isInitializing } = get();

    if (loading || hasInitiallyFetched || isInitializing) {
      return;
    }

    if (fetchPromise) {
      return fetchPromise;
    }

    set({ loading: true, error: null, isInitializing: true });

    fetchPromise = fetchWinterCollection()
      .then(result => {
        if (result.success) {
          set({
            winterProducts: result.data,
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

export const useWinterProducts = () =>
  useWinterStore(
    useShallow(state => ({
      products: state.filteredProducts,
      hasInitiallyFetched: state.hasInitiallyFetched,
    }))
  );

export const useWinterLoading = () => useWinterStore(state => state.loading);

export const useWinterError = () => useWinterStore(state => state.error);

//sort by
export const useWinterSort = () =>
  useWinterStore(
    useShallow(state => ({
      sortBy: state.sortBy,
      setSortBy: state.setSortBy,
    }))
  );
//--------

export const useWinterActions = () =>
  useWinterStore(
    useShallow(state => ({
      setWinterProducts: state.setWinterProducts,
      setSearchQuery: state.setSearchQuery,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchWinterCollection: state.fetchWinterCollection,
    }))
  );

export default useWinterStore;
