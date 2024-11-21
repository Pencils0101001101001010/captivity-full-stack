"use client";

import { create } from "zustand";
import { useCallback, useEffect } from "react";
import {
  uploadLogo,
  removeLogo,
  getLogo,
  getVendorLogoBySlug,
  type LogoActionResult,
} from "@/app/(vendor)/actions";

interface LogoStore {
  logoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useLogoStore = create<
  LogoStore & {
    upload: (formData: FormData) => Promise<void>;
    remove: () => Promise<void>;
    fetchLogo: (vendorWebsite?: string) => Promise<void>;
  }
>((set, get) => ({
  logoUrl: null,
  isLoading: false,
  error: null,
  lastFetched: 0,

  upload: async (formData: FormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadLogo(formData);
      if (!result.success) throw new Error(result.error || "Upload failed");

      set({
        logoUrl: result.url || null,
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

  remove: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await removeLogo();
      if (!result.success) throw new Error(result.error || "Remove failed");

      set({
        logoUrl: null,
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

  fetchLogo: async (vendorWebsite?: string) => {
    const { lastFetched, isLoading } = get();

    // Prevent multiple simultaneous fetches
    if (isLoading) return;

    // Check if data is fresh
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return;

    set({ isLoading: true, error: null });

    try {
      const result = vendorWebsite
        ? await getVendorLogoBySlug(vendorWebsite)
        : await getLogo();

      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        logoUrl: result.url || null,
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
export const useLogo = () => {
  const logoUrl = useLogoStore(state => state.logoUrl);
  return logoUrl;
};

export const useLogoLoading = () => {
  const isLoading = useLogoStore(state => state.isLoading);
  return isLoading;
};

export const useLogoError = () => {
  const error = useLogoStore(state => state.error);
  return error;
};

export const useLogoData = (vendorWebsite?: string) => {
  const fetchLogo = useLogoStore(state => state.fetchLogo);
  const lastFetched = useLogoStore(state => state.lastFetched);

  // Memoize the fetch function
  const memoizedFetch = useCallback(() => {
    if (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION) {
      fetchLogo(vendorWebsite);
    }
  }, [vendorWebsite, fetchLogo, lastFetched]);

  useEffect(() => {
    memoizedFetch();
  }, [memoizedFetch]);

  return {
    logoUrl: useLogo(),
    isLoading: useLogoLoading(),
    error: useLogoError(),
    upload: useLogoStore(state => state.upload),
    remove: useLogoStore(state => state.remove),
  };
};
