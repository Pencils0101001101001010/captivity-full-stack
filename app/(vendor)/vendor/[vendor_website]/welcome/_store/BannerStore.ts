"use client";

import { create } from "zustand";
import { useCallback, useEffect } from "react";
import {
  uploadBanner,
  removeBanner,
  getBanners,
  getVendorBannersBySlug,
} from "../_actions/banner-actions";

interface BannerItem {
  url: string;
}

interface BannerStore {
  banners: BannerItem[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useBannerStore = create<
  BannerStore & {
    upload: (formData: FormData) => Promise<void>;
    remove: (url: string) => Promise<void>;
    fetchBanners: (storeSlug?: string) => Promise<void>;
  }
>((set, get) => ({
  banners: [],
  isLoading: false,
  error: null,
  lastFetched: 0,

  upload: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadBanner(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        banners: (result.urls || []).map(url => ({ url })),
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
      const result = await removeBanner(url);
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        banners: (result.urls || []).map(url => ({ url })),
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

  fetchBanners: async (storeSlug?: string) => {
    const { lastFetched, isLoading } = get();

    // Prevent multiple simultaneous fetches
    if (isLoading) return;

    // Check if data is fresh
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return;

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
export const useBanners = () => {
  const banners = useBannerStore(state => state.banners);
  return banners;
};

export const useBannerLoading = () => {
  const isLoading = useBannerStore(state => state.isLoading);
  return isLoading;
};

export const useBannerError = () => {
  const error = useBannerStore(state => state.error);
  return error;
};

export const useBannerData = (storeSlug?: string) => {
  const fetchBanners = useBannerStore(state => state.fetchBanners);

  // Use useCallback to memoize the effect
  const memoizedFetch = useCallback(() => {
    fetchBanners(storeSlug);
  }, [storeSlug, fetchBanners]);

  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch]);
};
