import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
import {
  CategorizedProducts,
  CategoryType,
  SubCategory,
} from "@/app/(customer)/types";
import { fetchCategoryProducts } from "../_categoryActions/actions";

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

interface CategoryState {
  categoryProducts: { [key in CategoryType]?: CategorizedProducts };
  filteredProducts: CategorizedProducts | null;
  currentCategory: CategoryType | null;
  searchQuery: string;
  loading: boolean;
  error: string | null;
  hasInitiallyFetched: boolean;
  isInitializing: boolean;
  sortBy: SortValue;
}

interface CategoryActions {
  setCategoryProducts: (
    category: CategoryType,
    products: CategorizedProducts
  ) => void;
  setFilteredProducts: (products: CategorizedProducts) => void;
  setCurrentCategory: (category: CategoryType) => Promise<void>;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchCategory: (category: CategoryType) => Promise<void>;
  setSortBy: (sortBy: SortValue) => void;
}

const initialState: CategoryState = {
  categoryProducts: {},
  filteredProducts: null,
  currentCategory: null,
  searchQuery: "",
  loading: false,
  error: null,
  hasInitiallyFetched: false,
  isInitializing: false,
  sortBy: "relevance",
};

let fetchPromise: { [key in CategoryType]?: Promise<void> } = {};

export const useCategoryStore = create<CategoryState & CategoryActions>()(
  (set, get) => ({
    ...initialState,

    setCategoryProducts: (category, products) =>
      set(state => ({
        categoryProducts: {
          ...state.categoryProducts,
          [category]: products,
        },
        filteredProducts: products,
      })),

    setFilteredProducts: products => set({ filteredProducts: products }),

    setCurrentCategory: async (category: CategoryType) => {
      const { categoryProducts, loading } = get();

      // Set the current category immediately
      set({ currentCategory: category });

      // If we don't have the products for this category and we're not already loading
      if (!categoryProducts[category] && !loading) {
        await get().fetchCategory(category);
      } else if (categoryProducts[category]) {
        // If we already have the products, update filtered products
        set({ filteredProducts: categoryProducts[category] });
      }
    },

    setSearchQuery: query => {
      const { currentCategory, categoryProducts } = get();
      if (!currentCategory || !categoryProducts[currentCategory]) return;

      const products = categoryProducts[currentCategory];
      set({ searchQuery: query });

      if (!query.trim()) {
        set({ filteredProducts: products });
        return;
      }

      const lowercaseQuery = query.toLowerCase().trim();
      const filtered = Object.entries(products).reduce(
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

    setSortBy: sortBy => {
      set({ sortBy });
      const { filteredProducts } = get();

      if (!filteredProducts) return;

      const allProducts = Object.values(filteredProducts as CategorizedProducts)
        .flat()
        .filter(Boolean);

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
        default:
          return;
      }

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

      sortedProducts.forEach(product => {
        const categories = product.category as string[];
        let categorized = false;

        (Object.keys(newSortedProducts) as SubCategory[]).forEach(category => {
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

    fetchCategory: async (category: CategoryType) => {
      const { loading } = get();

      if (loading || fetchPromise[category]) {
        return fetchPromise[category];
      }

      set({ loading: true, error: null });

      fetchPromise[category] = fetchCategoryProducts(category)
        .then(result => {
          if (result.success) {
            set(state => ({
              categoryProducts: {
                ...state.categoryProducts,
                [category]: result.data,
              },
              filteredProducts: result.data,
              hasInitiallyFetched: true,
              loading: false,
            }));
          } else {
            throw new Error(result.error);
          }
        })
        .catch(error => {
          set({
            error: (error as Error).message,
            loading: false,
            hasInitiallyFetched: true,
          });
        })
        .finally(() => {
          fetchPromise[category] = undefined;
        });

      return fetchPromise[category];
    },
  })
);

// Selectors
export const useCategoryProducts = (category: CategoryType) =>
  useCategoryStore(
    useShallow(state => ({
      products: state.filteredProducts,
      hasInitiallyFetched: state.hasInitiallyFetched,
    }))
  );

export const useCategoryLoading = () =>
  useCategoryStore(state => state.loading);
export const useCategoryError = () => useCategoryStore(state => state.error);
export const useCategorySort = () =>
  useCategoryStore(
    useShallow(state => ({
      sortBy: state.sortBy,
      setSortBy: state.setSortBy,
    }))
  );
