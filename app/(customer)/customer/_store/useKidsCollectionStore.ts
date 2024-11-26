import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";
import { fetchKidsCollection } from "../shopping/product_categories/kids/actions";

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

export type Category = "kids-collection";

export type CategorizedProducts = {
  [key in Category]: ProductWithRelations[];
};

interface KidsState {
  kidsProducts: CategorizedProducts;
  filteredProducts: CategorizedProducts;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
  sortBy: SortValue; // sort by
}

interface KidsActions {
  setKidsProducts: (products: CategorizedProducts) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchKidsCollection: () => Promise<void>;
  setSortBy: (sortBy: SortValue) => void; //sort by
}

const initialState: KidsState = {
  kidsProducts: {
    "kids-collection": [],
  },
  filteredProducts: {
    "kids-collection": [],
  },
  searchQuery: "",
  loading: false,
  error: null,
  hasInitiallyFetched: false,
  isInitializing: false,
  sortBy: "relevance", //sort by
};

let fetchPromise: Promise<void> | null = null;

const useKidsCollectionStore = create<KidsState & KidsActions>()(
  (set, get) => ({
    ...initialState,

    setKidsProducts: products =>
      set({ kidsProducts: products, filteredProducts: products }),

    setFilteredProducts: products => set({ filteredProducts: products }),

    setSearchQuery: query => {
      const { kidsProducts } = get();
      set({ searchQuery: query });

      if (!query.trim()) {
        set({ filteredProducts: kidsProducts });
        return;
      }

      const lowercaseQuery = query.toLowerCase().trim();
      const filtered = Object.entries(kidsProducts).reduce(
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
      const products = [...filteredProducts["kids-collection"]];

      // Sort the products
      let sortedProducts = [...products];
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
          sortedProducts.sort((a, b) => a.sellingPrice - b.sellingPrice);
          break;
        case "price-desc":
          sortedProducts.sort((a, b) => b.sellingPrice - a.sellingPrice);
          break;
      }

      set({
        filteredProducts: {
          "kids-collection": sortedProducts,
        },
      });
    },
    //---------------------------------------------------------------------------------
    fetchKidsCollection: async () => {
      const { loading, hasInitiallyFetched, isInitializing } = get();

      if (loading || hasInitiallyFetched || isInitializing) {
        return;
      }

      if (fetchPromise) {
        return fetchPromise;
      }

      set({ loading: true, error: null, isInitializing: true });

      fetchPromise = fetchKidsCollection()
        .then(result => {
          if (result.success) {
            set({
              kidsProducts: result.data,
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

export const useKidsProducts = () =>
  useKidsCollectionStore(
    useShallow(state => ({
      products: state.filteredProducts,
      hasInitiallyFetched: state.hasInitiallyFetched,
    }))
  );

export const useKidsLoading = () =>
  useKidsCollectionStore(state => state.loading);

export const useKidsError = () => useKidsCollectionStore(state => state.error);

//sort by
export const useKidsSort = () =>
  useKidsCollectionStore(
    useShallow(state => ({
      sortBy: state.sortBy,
      setSortBy: state.setSortBy,
    }))
  );
//--------

export const useKidsActions = () =>
  useKidsCollectionStore(
    useShallow(state => ({
      setKidsProducts: state.setKidsProducts,
      setSearchQuery: state.setSearchQuery,
      setLoading: state.setLoading,
      setError: state.setError,
      fetchKidsCollection: state.fetchKidsCollection,
    }))
  );

export default useKidsCollectionStore;
