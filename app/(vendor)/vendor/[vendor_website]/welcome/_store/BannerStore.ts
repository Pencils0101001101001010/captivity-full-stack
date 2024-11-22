"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";
import {
  uploadBanner,
  removeBanner,
  getBanners,
  getVendorBannersBySlug,
} from "../_actions/banner-actions";

interface BannerItem {
  url: string;
}

interface BannerState {
  banners: BannerItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  isHydrated: boolean;
  initialized: boolean;
}

interface BannerActions {
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchBanners: (storeSlug?: string) => Promise<void>;
  setBanners: (banners: BannerItem[]) => void;
  setHydrated: (state: boolean) => void;
  reset: () => void;
}

type BannerStore = BannerState & BannerActions;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache to ensure fresh data

const initialState: BannerState = {
  banners: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
  isHydrated: false,
  initialized: false,
};

export const useBannerStore = create<BannerStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      setBanners: (banners: BannerItem[]) => {
        set({
          banners,
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
          const result = await uploadBanner(formData);
          if (!result.success) throw new Error(result.error || "Upload failed");

          set({
            banners: (result.urls || []).map(url => ({ url })),
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
          const result = await removeBanner(url);
          if (!result.success) throw new Error(result.error || "Remove failed");

          set({
            banners: (result.urls || []).map(url => ({ url })),
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

      fetchBanners: async (storeSlug?: string) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = storeSlug
            ? await getVendorBannersBySlug(storeSlug)
            : await getBanners();

          if (!result.success) throw new Error(result.error || "Fetch failed");

          set({
            banners: (result.urls || []).map(url => ({ url })),
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
      name: "vendor-banner-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        banners: state.banners,
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
export const useBanners = () => useBannerStore(state => state.banners);
export const useBannerLoading = () => useBannerStore(state => state.isLoading);
export const useBannerError = () => useBannerStore(state => state.error);
export const useBannerHydrated = () =>
  useBannerStore(state => state.isHydrated);
export const useBannerInitialized = () =>
  useBannerStore(state => state.initialized);

export const useBannerData = (storeSlug?: string) => {
  const fetchBanners = useBannerStore(state => state.fetchBanners);
  const banners = useBanners();
  const isHydrated = useBannerHydrated();
  const lastFetched = useBannerStore(state => state.lastFetched);

  useEffect(() => {
    // Always fetch on mount and when cache expires
    if (
      isHydrated &&
      (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION)
    ) {
      fetchBanners(storeSlug);
    }
  }, [isHydrated, lastFetched, fetchBanners, storeSlug]);

  return {
    banners,
    isLoading: useBannerLoading(),
    error: useBannerError(),
    upload: useBannerStore(state => state.upload),
    remove: useBannerStore(state => state.remove),
  };
};
