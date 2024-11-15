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
  uploadCategory: (formData: FormData) => Promise<void>;
  removeCategory: (url: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchVendorCategories: (storeSlug: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryStore>(set => ({
  categories: [],
  isLoading: false,
  error: null,

  uploadCategory: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadCategory(formData);
      if (!result.success) throw new Error(result.error);
      set({ categories: result.categories || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  removeCategory: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await removeCategory(url);
      if (!result.success) throw new Error(result.error);
      set({ categories: result.categories || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Removal failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getCategories();
      if (!result.success) throw new Error(result.error);
      set({ categories: result.categories || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Fetch failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchVendorCategories: async (storeSlug: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getVendorCategoriesBySlug(storeSlug);
      if (!result.success) throw new Error(result.error);
      set({ categories: result.categories || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Fetch failed" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
