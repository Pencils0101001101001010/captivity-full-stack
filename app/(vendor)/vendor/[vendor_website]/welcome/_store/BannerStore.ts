"use client";

import { create } from "zustand";
import {
  uploadBanner,
  removeBanner,
  getBanners,
  getVendorBannersBySlug,
} from "../_actions/banner-actions";

interface BannerStore {
  banners: string[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
  uploadBanner: (formData: FormData) => Promise<void>;
  removeBanner: (url: string) => Promise<void>;
  fetchBanners: () => Promise<void>;
  fetchVendorBanners: (storeSlug: string) => Promise<void>;
}

const CACHE_DURATION = 60000; // 1 minute cache

export const useBannerStore = create<BannerStore>((set, get) => {
  const shouldFetch = () => {
    const now = Date.now();
    return !get().lastFetch || now - get().lastFetch > CACHE_DURATION;
  };

  return {
    banners: [],
    isLoading: false,
    error: null,
    lastFetch: 0,

    uploadBanner: async (formData: FormData) => {
      set({ isLoading: true, error: null });
      try {
        const result = await uploadBanner(formData);
        if (!result.success) throw new Error(result.error);
        set({
          banners: result.urls || [],
          lastFetch: Date.now(),
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Upload failed",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    removeBanner: async (url: string) => {
      set({ isLoading: true, error: null });
      try {
        const result = await removeBanner(url);
        if (!result.success) throw new Error(result.error);
        set({
          banners: result.urls || [],
          lastFetch: Date.now(),
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : "Removal failed",
        });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchBanners: async () => {
      if (!shouldFetch()) return;

      set({ isLoading: true, error: null });
      try {
        const result = await getBanners();
        if (!result.success) throw new Error(result.error);
        set({
          banners: result.urls || [],
          lastFetch: Date.now(),
        });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Fetch failed" });
      } finally {
        set({ isLoading: false });
      }
    },

    fetchVendorBanners: async (storeSlug: string) => {
      if (!shouldFetch()) return;

      set({ isLoading: true, error: null });
      try {
        const result = await getVendorBannersBySlug(storeSlug);
        if (!result.success) throw new Error(result.error);
        set({
          banners: result.urls || [],
          lastFetch: Date.now(),
        });
      } catch (error) {
        set({ error: error instanceof Error ? error.message : "Fetch failed" });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
