"use client";

import { create } from "zustand";
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
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useCategoryStore = create<
  CategoryStore & {
    upload: (formData: FormData) => Promise<void>;
    remove: (url: string) => Promise<void>;
    fetchCategories: (storeSlug?: string) => Promise<void>;
  }
>((set, get) => ({
  categories: [],
  isLoading: false,
  error: null,
  lastFetched: 0,

  upload: async (formData: FormData) => {
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

    // Prevent multiple simultaneous fetches
    if (isLoading) return;

    // Check if data is fresh
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return;

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
}));

// Memoized selector hooks
export const useCategories = () => {
  const categories = useCategoryStore(state => state.categories);
  return categories;
};

export const useCategoryLoading = () => {
  const isLoading = useCategoryStore(state => state.isLoading);
  return isLoading;
};

export const useCategoryError = () => {
  const error = useCategoryStore(state => state.error);
  return error;
};

export const useCategoryData = (storeSlug?: string) => {
  const fetchCategories = useCategoryStore(state => state.fetchCategories);

  // Use useCallback to memoize the effect
  const memoizedFetch = useCallback(() => {
    fetchCategories(storeSlug);
  }, [storeSlug, fetchCategories]);

  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch]);
};
