import { create } from "zustand";
import {
  uploadBestSeller,
  removeBestSeller,
  getBestSellers,
  getVendorBestSellersBySlug,
} from "../_actions/best_seller-actions";

interface BestSellerStore {
  bestSellers: string[];
  isLoading: boolean;
  error: string | null;
  uploadBestSeller: (formData: FormData) => Promise<void>;
  removeBestSeller: (url: string) => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchVendorBestSellers: (storeSlug: string) => Promise<void>;
}

export const useBestSellerStore = create<BestSellerStore>(set => ({
  bestSellers: [],
  isLoading: false,
  error: null,

  uploadBestSeller: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadBestSeller(formData);
      if (!result.success) throw new Error(result.error);
      set({ bestSellers: result.urls || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  removeBestSeller: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await removeBestSeller(url);
      if (!result.success) throw new Error(result.error);
      set({ bestSellers: result.urls || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Removal failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBestSellers: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getBestSellers();
      if (!result.success) throw new Error(result.error);
      set({ bestSellers: result.urls || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Fetch failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchVendorBestSellers: async (storeSlug: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getVendorBestSellersBySlug(storeSlug);
      if (!result.success) throw new Error(result.error);
      set({ bestSellers: result.urls || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Fetch failed" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
