"use client";

import { create } from "zustand";
import { useCallback, useEffect } from "react";
import {
  uploadBestSeller as uploadBestSellerAction,
  removeBestSeller as removeBestSellerAction,
  getBestSellers,
  getVendorBestSellersBySlug,
} from "../_actions/best_seller-actions";

export interface BestSellerItem {
  url: string;
  productName: string;
}

interface BestSellerStore {
  bestSellers: BestSellerItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useBestSellerStore = create<
  BestSellerStore & {
    upload: (formData: FormData) => Promise<void>;
    remove: (url: string) => Promise<void>;
    fetchBestSellers: (storeSlug?: string) => Promise<void>;
  }
>((set, get) => ({
  bestSellers: [],
  isLoading: false,
  error: null,
  lastFetched: 0,

  upload: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadBestSellerAction(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        bestSellers: result.urls || [],
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
      const result = await removeBestSellerAction(url);
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        bestSellers: result.urls || [],
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

  fetchBestSellers: async (storeSlug?: string) => {
    const { lastFetched, isLoading } = get();

    // Prevent multiple simultaneous fetches
    if (isLoading) return;

    // Check if data is fresh
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return;

    set({ isLoading: true, error: null });

    try {
      const result = storeSlug
        ? await getVendorBestSellersBySlug(storeSlug)
        : await getBestSellers();

      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        bestSellers: result.urls || [],
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
export const useBestSellers = () => {
  const bestSellers = useBestSellerStore(state => state.bestSellers);
  return bestSellers;
};

export const useBestSellerLoading = () => {
  const isLoading = useBestSellerStore(state => state.isLoading);
  return isLoading;
};

export const useBestSellerError = () => {
  const error = useBestSellerStore(state => state.error);
  return error;
};

export const useBestSellerData = (storeSlug?: string) => {
  const fetchBestSellers = useBestSellerStore(state => state.fetchBestSellers);

  // Use useCallback to memoize the effect
  const memoizedFetch = useCallback(() => {
    fetchBestSellers(storeSlug);
  }, [storeSlug, fetchBestSellers]);

  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch]);
};
