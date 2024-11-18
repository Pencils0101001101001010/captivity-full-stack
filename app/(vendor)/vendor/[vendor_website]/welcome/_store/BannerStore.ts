// _store/BannerStore.ts
"use client";

import { create } from "zustand";
import {
  uploadBanner,
  removeBanner,
  getBanners,
  getVendorBannersBySlug,
} from "../_actions/banner-actions";
import { useEffect } from "react";

interface BannerItem {
  url: string;
}

interface BannerActionResult {
  success: boolean;
  urls?: string[];
  url?: string;
  error?: string;
}

interface BannerStore {
  banners: BannerItem[];
  isLoading: boolean;
  error: string | null;
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetchBanners: () => Promise<void>;
  fetchVendorBanners: (storeSlug: string) => Promise<void>;
}

const mapUrlsToBannerItems = (urls: string[] = []): BannerItem[] => {
  return urls.map(url => ({ url }));
};

export const useBannerStore = create<BannerStore>(set => ({
  banners: [],
  isLoading: false,
  error: null,

  upload: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadBanner(formData);
      if (!result.success) throw new Error(result.error);
      set({
        banners: mapUrlsToBannerItems(result.urls),
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
      const result = await removeBanner(url);
      if (!result.success) throw new Error(result.error);
      set({
        banners: mapUrlsToBannerItems(result.urls),
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

  fetchBanners: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getBanners();
      if (!result.success) throw new Error(result.error);
      set({
        banners: mapUrlsToBannerItems(result.urls),
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

  fetchVendorBanners: async (storeSlug: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getVendorBannersBySlug(storeSlug);
      if (!result.success) throw new Error(result.error);
      set({
        banners: mapUrlsToBannerItems(result.urls),
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

// Export the selector hooks
export const useBanners = () => useBannerStore(state => state.banners);
export const useBannerLoading = () => useBannerStore(state => state.isLoading);
export const useBannerError = () => useBannerStore(state => state.error);

export const useBannerData = (storeSlug?: string) => {
  const fetchBanners = useBannerStore(state => state.fetchBanners);
  const fetchVendorBanners = useBannerStore(state => state.fetchVendorBanners);

  useEffect(() => {
    if (storeSlug) {
      fetchVendorBanners(storeSlug);
    } else {
      fetchBanners();
    }
  }, [storeSlug, fetchBanners, fetchVendorBanners]);
};
