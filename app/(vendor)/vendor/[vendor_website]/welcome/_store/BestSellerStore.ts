"use client";

import { create } from "zustand";
import {
  uploadBestSeller,
  removeBestSeller,
  getBestSellers,
  getVendorBestSellersBySlug,
} from "../_actions/best_seller-actions";

interface BestSellerItem {
  url: string;
  productName: string;
}

interface BestSellerStore {
  bestSellers: BestSellerItem[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
  uploadBestSeller: (formData: FormData) => Promise<void>;
  removeBestSeller: (url: string) => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchVendorBestSellers: (storeSlug: string) => Promise<void>;
}

const CACHE_DURATION = 60000; // 1 minute cache
const DEBOUNCE_DELAY = 300; // 300ms debounce

export const useBestSellerStore = create<BestSellerStore>((set, get) => {
  let debounceTimer: NodeJS.Timeout | null = null;

  const shouldFetch = () => {
    const now = Date.now();
    return !get().lastFetch || now - get().lastFetch > CACHE_DURATION;
  };

  const debounce = (fn: Function) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => fn(), DEBOUNCE_DELAY);
  };

  const updateState = (
    loading: boolean,
    error: string | null = null,
    bestSellers?: BestSellerItem[]
  ) => {
    const updates: Partial<BestSellerStore> = { isLoading: loading };
    if (error !== undefined) updates.error = error;
    if (bestSellers !== undefined) {
      updates.bestSellers = bestSellers;
      updates.lastFetch = Date.now();
    }
    set(updates);
  };

  return {
    bestSellers: [],
    isLoading: false,
    error: null,
    lastFetch: 0,

    uploadBestSeller: async (formData: FormData) => {
      updateState(true, null);
      try {
        const result = await uploadBestSeller(formData);
        if (!result.success) throw new Error(result.error);
        updateState(false, null, result.urls || []);
      } catch (error) {
        updateState(
          false,
          error instanceof Error ? error.message : "Upload failed"
        );
      }
    },

    removeBestSeller: async (url: string) => {
      updateState(true, null);
      try {
        const result = await removeBestSeller(url);
        if (!result.success) throw new Error(result.error);
        updateState(false, null, result.urls || []);
      } catch (error) {
        updateState(
          false,
          error instanceof Error ? error.message : "Removal failed"
        );
      }
    },

    fetchBestSellers: async () => {
      if (!shouldFetch()) return;

      const fetch = async () => {
        if (get().isLoading) return;

        updateState(true, null);
        try {
          const result = await getBestSellers();
          if (!result.success) throw new Error(result.error);
          updateState(false, null, result.urls || []);
        } catch (error) {
          updateState(
            false,
            error instanceof Error ? error.message : "Fetch failed"
          );
        }
      };

      debounce(fetch);
    },

    fetchVendorBestSellers: async (storeSlug: string) => {
      if (!shouldFetch()) return;

      const fetch = async () => {
        if (get().isLoading) return;

        updateState(true, null);
        try {
          const result = await getVendorBestSellersBySlug(storeSlug);
          if (!result.success) throw new Error(result.error);
          updateState(false, null, result.urls || []);
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
export const useBestSellerData = () =>
  useBestSellerStore(state => state.bestSellers);
export const useBestSellerLoading = () =>
  useBestSellerStore(state => state.isLoading);
export const useBestSellerError = () =>
  useBestSellerStore(state => state.error);

// Example usage in component:
// const bestSellers = useBestSellerData();
// const isLoading = useBestSellerLoading();
// const error = useBestSellerError();
