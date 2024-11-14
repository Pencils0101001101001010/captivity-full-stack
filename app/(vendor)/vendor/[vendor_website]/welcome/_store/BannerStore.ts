import { create } from "zustand";
import {
  uploadBanner,
  removeBanner,
  getBanners,
  getVendorBannersBySlug,
} from "../actions";

interface BannerStore {
  banners: string[];
  isLoading: boolean;
  error: string | null;
  uploadBanner: (formData: FormData) => Promise<void>;
  removeBanner: (url: string) => Promise<void>;
  fetchBanners: () => Promise<void>;
  fetchVendorBanners: (storeSlug: string) => Promise<void>;
}

export const useBannerStore = create<BannerStore>(set => ({
  banners: [],
  isLoading: false,
  error: null,

  uploadBanner: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadBanner(formData);
      if (!result.success) throw new Error(result.error);
      set({ banners: result.urls || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Upload failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  removeBanner: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await removeBanner(url);
      if (!result.success) throw new Error(result.error);
      set({ banners: result.urls || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Removal failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBanners: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getBanners();
      if (!result.success) throw new Error(result.error);
      set({ banners: result.urls || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Fetch failed" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchVendorBanners: async (storeSlug: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await getVendorBannersBySlug(storeSlug);
      if (!result.success) throw new Error(result.error);
      set({ banners: result.urls || [] });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Fetch failed" });
    } finally {
      set({ isLoading: false });
    }
  },
}));
