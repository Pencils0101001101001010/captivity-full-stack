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
export type Category = "sport-collection";
// | "men"
// | "women"
// | "kids"
// | "hats"
// | "golfers"
// | "bottoms"
// | "caps"
// | "pre-curved-peaks"

export type CategorizedProducts = Record<Category, ProductWithRelations[]>;

interface SportState {
  sportProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
  sortBy: SortValue; //sort filter
}

interface SportActions {
  setSportProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSportCollection: () => Promise<void>;
  setSortBy: (sortBy: SortValue) => void; //sort filter
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
  sortBy: "relevance" as SortValue, //sort filter
};

let fetchPromise: Promise<void> | null = null;

const useSportStore = create<SportState & SportActions>()((set, get) => ({
  ...initialState,
  sortBy: "relevance", //sort filter

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
  //sort filter
  setSortBy: sortBy => {
    set({ sortBy });
    const { filteredProducts } = get();

    // First, combine all products into a single array
    const allProducts = Object.values(filteredProducts).flat().filter(Boolean);

    // Sort all products together
    let sortedAllProducts = [...allProducts];

    switch (sortBy) {
      case "code-asc":
        sortedAllProducts.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case "code-desc":
        sortedAllProducts.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case "name-asc":
        sortedAllProducts.sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
        break;
      case "name-desc":
        sortedAllProducts.sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
        break;
      case "stock-asc":
        sortedAllProducts.sort((a, b) => {
          const aStock = a.variations.reduce((sum, v) => sum + v.quantity, 0);
          const bStock = b.variations.reduce((sum, v) => sum + v.quantity, 0);
          return aStock - bStock;
        });
        break;
      case "stock-desc":
        sortedAllProducts.sort((a, b) => {
          const aStock = a.variations.reduce((sum, v) => sum + v.quantity, 0);
          const bStock = b.variations.reduce((sum, v) => sum + v.quantity, 0);
          return bStock - aStock;
        });
        break;
      case "price-asc":
        sortedAllProducts.sort((a, b) => {
          const priceA = Number(a.sellingPrice) || 0;
          const priceB = Number(b.sellingPrice) || 0;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        sortedAllProducts.sort((a, b) => {
          const priceA = Number(a.sellingPrice) || 0;
          const priceB = Number(b.sellingPrice) || 0;
          return priceB - priceA;
        });
        break;
      default:
        // 'relevance' - keep original order
        break;
    }

    // Create new categorized products object with proper typing
    const newSortedProducts: CategorizedProducts = {
      "sport-collection": [],
      // uncategorised: [],
    };

    // Distribute sorted products into categories
    sortedAllProducts.forEach(product => {
      const categories = product.category as string[];
      let categorized = false;

      (Object.keys(newSortedProducts) as Category[]).forEach(category => {
        {
          newSortedProducts[category].push(product);
          categorized = true;
        }
      });
    });

    set({ filteredProducts: newSortedProducts });
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

//sort filter
export const useSportSort = () =>
  useSportStore(
    useShallow(state => ({
      sortBy: state.sortBy,
      setSortBy: state.setSortBy,
    }))
  );

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
