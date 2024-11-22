import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { useCallback, useEffect } from "react";
import {
  uploadCategory,
  removeCategory,
  getCategories,
  getVendorCategoriesBySlug,
} from "../_actions/category-actions";

interface CategoryItem {
  url: string;
  categoryName: string;
}

interface CategoryStore {
  categories: CategoryItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchCategories: (storeSlug?: string) => Promise<void>;
  reset: () => void;
}

type CategoryStorePersist = Pick<CategoryStore, "categories" | "lastFetched">;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const persistOptions: PersistOptions<CategoryStore, CategoryStorePersist> = {
  name: "category-store",
  partialize: state => ({
    categories: state.categories,
    lastFetched: state.lastFetched,
  }),
};

const initialState = {
  categories: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      reset: () => {
        const currentState = get();
        if (currentState.isLoading) {
          return;
        }
        set(initialState);
      },

      upload: async (formData: FormData) => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });

        try {
          const result = await uploadCategory(formData);
          if (!result.success) throw new Error(result.error || "Upload failed");

          set({
            categories: result.categories || [],
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Upload failed",
          });
          throw error;
        }
      },

      remove: async (url: string) => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });

        try {
          const result = await removeCategory(url);
          if (!result.success) throw new Error(result.error || "Remove failed");

          set({
            categories: result.categories || [],
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Remove failed",
          });
          throw error;
        }
      },

      fetchCategories: async (storeSlug?: string) => {
        const { lastFetched, isLoading } = get();

        if (isLoading) return;
        if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const result = storeSlug
            ? await getVendorCategoriesBySlug(storeSlug)
            : await getCategories();

          if (!result.success) throw new Error(result.error || "Fetch failed");

          set({
            categories: result.categories || [],
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Fetch failed",
          });
        }
      },
    }),
    persistOptions
  )
);

// Selector hooks for better performance
export const useCategories = () => useCategoryStore(state => state.categories);
export const useCategoryLoading = () =>
  useCategoryStore(state => state.isLoading);
export const useCategoryError = () => useCategoryStore(state => state.error);

export const useCategoryData = (storeSlug?: string) => {
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const lastFetched = useCategoryStore(state => state.lastFetched);
  const categories = useCategories();
  const isLoading = useCategoryLoading();
  const error = useCategoryError();

  const checkAndFetchData = useCallback(() => {
    if (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION) {
      fetchCategories(storeSlug);
    }
  }, [fetchCategories, lastFetched, storeSlug]);

  useEffect(() => {
    checkAndFetchData();
  }, [checkAndFetchData]);

  return {
    categories,
    isLoading,
    error,
    upload: useCategoryStore(state => state.upload),
    remove: useCategoryStore(state => state.remove),
  };
};
