"use client";

import { create } from "zustand";
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
  lastFetch: number;
  uploadCategory: (formData: FormData) => Promise<void>;
  removeCategory: (url: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchVendorCategories: (storeSlug: string) => Promise<void>;
}

const CACHE_DURATION = 60000; // 1 minute cache
const DEBOUNCE_DELAY = 300; // 300ms debounce

export const useCategoryStore = create<CategoryStore>((set, get) => {
  let debounceTimer: NodeJS.Timeout | null = null;

  // Check if we need to fetch new data
  const shouldFetch = () => {
    const now = Date.now();
    return !get().lastFetch || now - get().lastFetch > CACHE_DURATION;
  };

  // Debounce helper
  const debounce = (fn: Function) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn(), DEBOUNCE_DELAY);
  };

  // Helper to batch state updates
  const updateState = (
    loading: boolean,
    error: string | null = null,
    categories?: CategoryItem[]
  ) => {
    const updates: Partial<CategoryStore> = { isLoading: loading };
    if (error !== undefined) updates.error = error;
    if (categories !== undefined) {
      updates.categories = categories;
      updates.lastFetch = Date.now();
    }
    set(updates);
  };

  return {
    categories: [],
    isLoading: false,
    error: null,
    lastFetch: 0,

    uploadCategory: async (formData: FormData) => {
      updateState(true, null);
      try {
        const result = await uploadCategory(formData);
        if (!result.success) throw new Error(result.error);
        updateState(false, null, result.categories || []);
      } catch (error) {
        updateState(
          false,
          error instanceof Error ? error.message : "Upload failed"
        );
      }
    },

    removeCategory: async (url: string) => {
      updateState(true, null);
      try {
        const result = await removeCategory(url);
        if (!result.success) throw new Error(result.error);
        updateState(false, null, result.categories || []);
      } catch (error) {
        updateState(
          false,
          error instanceof Error ? error.message : "Removal failed"
        );
      }
    },

    fetchCategories: async () => {
      if (!shouldFetch()) return;

      const fetch = async () => {
        if (get().isLoading) return;

        updateState(true, null);
        try {
          const result = await getCategories();
          if (!result.success) throw new Error(result.error);
          updateState(false, null, result.categories || []);
        } catch (error) {
          updateState(
            false,
            error instanceof Error ? error.message : "Fetch failed"
          );
        }
      };

      debounce(fetch);
    },

    fetchVendorCategories: async (storeSlug: string) => {
      if (!shouldFetch()) return;

      const fetch = async () => {
        if (get().isLoading) return;

        updateState(true, null);
        try {
          const result = await getVendorCategoriesBySlug(storeSlug);
          if (!result.success) throw new Error(result.error);
          updateState(false, null, result.categories || []);
        } catch (error) {
          updateState(
            false,
            error instanceof Error ? error.message : "Fetch failed"
          );
        }
      };

      debounce(fetch);
    },
  };
});

// Optional: Add selector hooks for better performance
export const useCategoryData = () =>
  useCategoryStore(state => state.categories);
export const useCategoryLoading = () =>
  useCategoryStore(state => state.isLoading);
export const useCategoryError = () => useCategoryStore(state => state.error);
