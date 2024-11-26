import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchSignatureCollection } from "../shopping/product_categories/signature/actions";

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

export type Category =
  | "men"
  | "women"
  | "kids"
  | "hats"
  | "golfers"
  | "bottoms"
  | "caps"
  | "flat-peaks"
  | "pre-curved-peaks"
  | "uncategorised";

export type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

interface SignatureState {
  signatureProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
  sortBy: SortValue; //sort filter
}

interface SignatureActions {
  setSignatureProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchSignatureCollection: () => Promise<void>;
  setSortBy: (sortBy: SortValue) => void; //sort filter
}

const initialState: SignatureState = {
  signatureProducts: {
    men: [],
    women: [],
    kids: [],
    hats: [],
    golfers: [],
    bottoms: [],
    caps: [],
    "flat-peaks": [],
    "pre-curved-peaks": [],
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
    "flat-peaks": [],
    "pre-curved-peaks": [],
    uncategorised: [],
  },
  searchQuery: "",
  loading: false,
  error: null,
  hasInitiallyFetched: false,
  isInitializing: false,
  sortBy: "relevance" as SortValue, //sort filter
};

let fetchPromise: Promise<void> | null = null;

const useSignatureStore = create<SignatureState & SignatureActions>()(
  (set, get) => ({
    ...initialState,
    sortBy: "relevance", //sort filter

    setSignatureProducts: products =>
      set({ signatureProducts: products, filteredProducts: products }),

    setFilteredProducts: products => set({ filteredProducts: products }),

    setSearchQuery: query => {
      const { signatureProducts } = get();
      set({ searchQuery: query });

      if (!query.trim()) {
        set({ filteredProducts: signatureProducts });
        return;
      }

      const lowercaseQuery = query.toLowerCase().trim();
      const filtered = Object.entries(signatureProducts).reduce(
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

    fetchSignatureCollection: async () => {
      const { loading, hasInitiallyFetched, isInitializing } = get();

      if (loading || hasInitiallyFetched || isInitializing) {
        return;
      }

      if (fetchPromise) {
        return fetchPromise;
      }

      set({ loading: true, error: null, isInitializing: true });

      fetchPromise = fetchSignatureCollection()
        .then(result => {
          if (result.success) {
            set({
              signatureProducts: result.data as CategorizedProducts,
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
      const allProducts = Object.values(filteredProducts)
        .flat()
        .filter(Boolean);

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
        men: [],
        "flat-peaks": [],
        "pre-curved-peaks": [],
        women: [],
        kids: [],
        hats: [],
        golfers: [],
        bottoms: [],
        caps: [],
        uncategorised: [],
      };

      // Distribute sorted products into categories
      sortedAllProducts.forEach(product => {
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
  })
);

export const useSignatureProducts = () =>
  useSignatureStore(
    useShallow(state => ({
      products: state.filteredProducts,
      hasInitiallyFetched: state.hasInitiallyFetched,
    }))
  );

export const useSignatureLoading = () =>
  useSignatureStore(state => state.loading);

export const useSignatureError = () => useSignatureStore(state => state.error);

//sort filter
export const useSignatureSort = () =>
  useSignatureStore(
    useShallow(state => ({
      sortBy: state.sortBy,
      setSortBy: state.setSortBy,
    }))
  );

export const useSignatureActions = () =>
  useSignatureStore(
    useShallow(state => ({
      setSummerProducts: state.setSignatureProducts,
      setSearchQuery: state.setSearchQuery,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchSignatureCollection: state.fetchSignatureCollection,
    }))
  );

export default useSignatureStore;
