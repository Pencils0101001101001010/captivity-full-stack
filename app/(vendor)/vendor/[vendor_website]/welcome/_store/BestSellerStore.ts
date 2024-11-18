// _store/BestSellerStore.ts
"use client";

import { create } from "zustand";
import {
  uploadBestSeller as uploadBestSellerAction,
  removeBestSeller as removeBestSellerAction,
  getBestSellers,
  getVendorBestSellersBySlug,
} from "../_actions/best_seller-actions";
import { useEffect } from "react";

export interface BestSellerItem {
  url: string;
  productName: string;
}

interface BestSellerStore {
  bestSellers: BestSellerItem[];
  isLoading: boolean;
  error: string | null;
  // Match the component usage with upload/remove
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchBestSellers: () => Promise<void>;
  fetchVendorBestSellers: (storeSlug: string) => Promise<void>;
}

export const useBestSellerStore = create<BestSellerStore>(set => ({
  bestSellers: [],
  isLoading: false,
  error: null,

  upload: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadBestSellerAction(formData);
      if (!result.success) throw new Error(result.error);
      set({
        bestSellers: result.urls || [],
        isLoading: false,
        error: null,
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
      if (!result.success) throw new Error(result.error);
      set({
        bestSellers: result.urls || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Remove failed",
      });
      throw error;
    }
  },

  fetchBestSellers: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getBestSellers();
      if (!result.success) throw new Error(result.error);
      set({
        bestSellers: result.urls || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      });
    }
  },

  fetchVendorBestSellers: async (storeSlug: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getVendorBestSellersBySlug(storeSlug);
      if (!result.success) throw new Error(result.error);
      set({
        bestSellers: result.urls || [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Fetch failed",
      });
    }
  },
}));

// Selector hooks that match your component usage
export const useBestSellers = () =>
  useBestSellerStore(state => state.bestSellers);
export const useBestSellerLoading = () =>
  useBestSellerStore(state => state.isLoading);
export const useBestSellerError = () =>
  useBestSellerStore(state => state.error);

export const useBestSellerData = (storeSlug?: string) => {
  const fetchBestSellers = useBestSellerStore(state => state.fetchBestSellers);
  const fetchVendorBestSellers = useBestSellerStore(
    state => state.fetchVendorBestSellers
  );

  useEffect(() => {
    if (storeSlug) {
      fetchVendorBestSellers(storeSlug);
    } else {
      fetchBestSellers();
    }
  }, [storeSlug, fetchBestSellers, fetchVendorBestSellers]);
};
