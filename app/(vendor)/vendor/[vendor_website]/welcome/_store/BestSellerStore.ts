"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";
import {
  uploadBestSeller,
  removeBestSeller,
  getBestSellers,
  getVendorBestSellersBySlug,
} from "../_actions/best_seller-actions";

export interface BestSellerItem {
  url: string;
  productName: string;
}

interface BestSellerState {
  bestSellers: BestSellerItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  isHydrated: boolean;
  initialized: boolean;
}

interface BestSellerActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchBestSellers: (storeSlug?: string) => Promise<void>;
  setBestSellers: (bestSellers: BestSellerItem[]) => void;
  setHydrated: (state: boolean) => void;
  reset: () => void;
}

type BestSellerStore = BestSellerState & BestSellerActions;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache to ensure fresh data

const initialState: BestSellerState = {
  bestSellers: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
  isHydrated: false,
  initialized: false,
};

export const useBestSellerStore = create<BestSellerStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      setBestSellers: (bestSellers: BestSellerItem[]) => {
        set({
          bestSellers,
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
          const result = await uploadBestSeller(formData);
          if (!result.success) throw new Error(result.error || "Upload failed");

          set({
            bestSellers: result.urls || [],
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
          const result = await removeBestSeller(url);
          if (!result.success) throw new Error(result.error || "Remove failed");

          set({
            bestSellers: result.urls || [],
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

      fetchBestSellers: async (storeSlug?: string) => {
        const { isLoading } = get();
        if (isLoading) return;

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
      name: "vendor-bestseller-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        bestSellers: state.bestSellers,
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
export const useBestSellers = () =>
  useBestSellerStore(state => state.bestSellers);
export const useBestSellerLoading = () =>
  useBestSellerStore(state => state.isLoading);
export const useBestSellerError = () =>
  useBestSellerStore(state => state.error);
export const useBestSellerHydrated = () =>
  useBestSellerStore(state => state.isHydrated);
export const useBestSellerInitialized = () =>
  useBestSellerStore(state => state.initialized);

export const useBestSellerData = (storeSlug?: string) => {
  const fetchBestSellers = useBestSellerStore(state => state.fetchBestSellers);
  const bestSellers = useBestSellers();
  const isHydrated = useBestSellerHydrated();
  const lastFetched = useBestSellerStore(state => state.lastFetched);

  useEffect(() => {
    // Always fetch on mount and when cache expires
    if (
      isHydrated &&
      (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION)
    ) {
      fetchBestSellers(storeSlug);
    }
  }, [isHydrated, lastFetched, fetchBestSellers, storeSlug]);

  return {
    bestSellers,
    isLoading: useBestSellerLoading(),
    error: useBestSellerError(),
    upload: useBestSellerStore(state => state.upload),
    remove: useBestSellerStore(state => state.remove),
  };
};
