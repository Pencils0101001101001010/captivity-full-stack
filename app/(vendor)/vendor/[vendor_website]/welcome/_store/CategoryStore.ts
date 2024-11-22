"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";
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

interface CategoryState {
  categories: CategoryItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  isHydrated: boolean;
  initialized: boolean;
}

interface CategoryActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchCategories: (storeSlug?: string) => Promise<void>;
  setCategories: (categories: CategoryItem[]) => void;
  setHydrated: (state: boolean) => void;
  reset: () => void;
}

type CategoryStore = CategoryState & CategoryActions;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache to ensure fresh data

const initialState: CategoryState = {
  categories: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
  isHydrated: false,
  initialized: false,
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      setCategories: (categories: CategoryItem[]) => {
        set({
          categories,
          lastFetched: Date.now(),
          initialized: true,
        });
      },

      reset: () => {
        const { isLoading } = get();
        if (isLoading) return;
        set(initialState);
      },

      upload: async (formData: FormData) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await uploadCategory(formData);
          if (!result.success) throw new Error(result.error || "Upload failed");

          set({
            categories: result.categories || [],
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
            initialized: true,
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
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await removeCategory(url);
          if (!result.success) throw new Error(result.error || "Remove failed");

          set({
            categories: result.categories || [],
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
            initialized: true,
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
        const { isLoading } = get();
        if (isLoading) return;

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
            initialized: true,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Fetch failed",
            lastFetched: Date.now(),
          });
        }
      },
    }),
    {
      name: "vendor-category-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        categories: state.categories,
        lastFetched: state.lastFetched,
        initialized: state.initialized,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selector hooks
export const useCategories = () => useCategoryStore(state => state.categories);
export const useCategoryLoading = () =>
  useCategoryStore(state => state.isLoading);
export const useCategoryError = () => useCategoryStore(state => state.error);
export const useCategoryHydrated = () =>
  useCategoryStore(state => state.isHydrated);
export const useCategoryInitialized = () =>
  useCategoryStore(state => state.initialized);

export const useCategoryData = (storeSlug?: string) => {
  const fetchCategories = useCategoryStore(state => state.fetchCategories);
  const categories = useCategories();
  const isHydrated = useCategoryHydrated();
  const lastFetched = useCategoryStore(state => state.lastFetched);

  useEffect(() => {
    // Always fetch on mount and when cache expires
    if (
      isHydrated &&
      (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION)
    ) {
      fetchCategories(storeSlug);
    }
  }, [isHydrated, lastFetched, fetchCategories, storeSlug]);

  return {
    categories,
    isLoading: useCategoryLoading(),
    error: useCategoryError(),
    upload: useCategoryStore(state => state.upload),
    remove: useCategoryStore(state => state.remove),
  };
};
