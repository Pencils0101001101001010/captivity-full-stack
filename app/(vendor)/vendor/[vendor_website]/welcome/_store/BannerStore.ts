"use client";

import { create } from "zustand";
import {
  uploadBanner,
  removeBanner,
  getBanners,
  getVendorBannersBySlug,
} from "../_actions/banner-actions";
import { useEffect } from "react";

interface BannerStore {
  banners: string[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  currentFetch: AbortController | null;
  uploadBanner: (formData: FormData) => Promise<void>;
  removeBanner: (url: string) => Promise<void>;
  fetchBanners: () => Promise<void>;
  fetchVendorBanners: (storeSlug: string) => Promise<void>;
  resetState: () => void;
}

export const useBannerStore = create<BannerStore>((set, get) => ({
  banners: [],
  isLoading: false,
  error: null,
  initialized: false,
  currentFetch: null,

  resetState: () => {
    const { currentFetch } = get();
    if (currentFetch) {
      currentFetch.abort();
    }
    set({
      banners: [],
      isLoading: false,
      error: null,
      initialized: false,
      currentFetch: null,
    });
  },

  uploadBanner: async (formData: FormData) => {
    const state = get();
    if (state.isLoading) return;

    set({ isLoading: true, error: null });
    try {
      // Optimistic update with temporary URL
      const tempUrl = URL.createObjectURL(formData.get("file") as File);
      set(state => ({ banners: [...state.banners, tempUrl] }));

      const result = await uploadBanner(formData);
      if (!result.success) throw new Error(result.error);

      // Update with actual URLs
      set({ banners: result.urls || [] });
    } catch (error) {
      // Revert optimistic update on error
      const revertResult = await getBanners();
      if (revertResult.success) {
        set({ banners: revertResult.urls || [] });
      }
      set({
        error: error instanceof Error ? error.message : "Upload failed",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeBanner: async (url: string) => {
    const state = get();
    if (state.isLoading) return;

    set({ isLoading: true, error: null });
    try {
      // Optimistic update
      set(state => ({
        banners: state.banners.filter(banner => banner !== url),
      }));

      const result = await removeBanner(url);
      if (!result.success) throw new Error(result.error);

      set({ banners: result.urls || [] });
    } catch (error) {
      // Revert optimistic update on error
      const revertResult = await getBanners();
      if (revertResult.success) {
        set({ banners: revertResult.urls || [] });
      }
      set({
        error: error instanceof Error ? error.message : "Removal failed",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBanners: async () => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    // Cancel any existing fetch
    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getBanners();

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (!result.success) throw new Error(result.error);

      set({
        banners: result.urls || [],
        initialized: true,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      set({
        error: error instanceof Error ? error.message : "Fetch failed",
      });
    } finally {
      set(state => ({
        isLoading: false,
        currentFetch:
          state.currentFetch === controller ? null : state.currentFetch,
      }));
    }
  },

  fetchVendorBanners: async (storeSlug: string) => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    // Cancel any existing fetch
    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getVendorBannersBySlug(storeSlug);

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (!result.success) throw new Error(result.error);

      set({
        banners: result.urls || [],
        initialized: true,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      set({
        error: error instanceof Error ? error.message : "Fetch failed",
      });
    } finally {
      set(state => ({
        isLoading: false,
        currentFetch:
          state.currentFetch === controller ? null : state.currentFetch,
      }));
    }
  },
}));

// Custom hook for managing banner data fetching
export const useBannerData = (storeSlug?: string) => {
  const {
    fetchBanners,
    fetchVendorBanners,
    resetState,
    banners,
    isLoading,
    error,
  } = useBannerStore();

  useEffect(() => {
    if (storeSlug) {
      fetchVendorBanners(storeSlug);
    } else {
      fetchBanners();
    }

    return () => {
      resetState();
    };
  }, [storeSlug, fetchBanners, fetchVendorBanners, resetState]);

  return { banners, isLoading, error };
};
