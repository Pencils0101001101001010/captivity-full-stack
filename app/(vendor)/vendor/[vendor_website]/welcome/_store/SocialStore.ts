"use client";

import { create } from "zustand";
import { useCallback, useEffect } from "react";
import {
  createSocialLink,
  deleteSocialLink,
  getSocialLinks,
  getVendorSocialLinks,
  updateSocialLink,
} from "../_actions/social-actions";

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  userSettingsId: string;
}

type SocialLinkFormData = Omit<SocialLink, "id" | "userSettingsId">;

interface SocialLinkStore {
  links: SocialLink[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  currentFetch: AbortController | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useSocialLinkStore = create<
  SocialLinkStore & {
    update: (id: string, data: SocialLinkFormData) => Promise<void>;
    create: (data: SocialLinkFormData) => Promise<void>;
    remove: (id: string) => Promise<void>;
    fetchLinks: (vendorWebsite?: string) => Promise<void>;
    reset: () => void;
  }
>((set, get) => ({
  links: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
  currentFetch: null,

  reset: () => {
    const { currentFetch } = get();
    if (currentFetch) {
      currentFetch.abort();
    }
    set({
      links: [],
      isLoading: false,
      error: null,
      lastFetched: 0,
      currentFetch: null,
    });
  },

  update: async (id: string, data: SocialLinkFormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateSocialLink(id, data);
      if (!result.success) throw new Error(result.error || "Update failed");

      set({
        links: result.data || [],
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Update failed",
      });
      throw error;
    }
  },

  create: async (data: SocialLinkFormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createSocialLink(data);
      if (!result.success) throw new Error(result.error || "Creation failed");

      set({
        links: result.data || [],
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Creation failed",
      });
      throw error;
    }
  },

  remove: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await deleteSocialLink(id);
      if (!result.success) throw new Error(result.error || "Deletion failed");

      set({
        links: result.data || [],
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Deletion failed",
      });
      throw error;
    }
  },

  fetchLinks: async (vendorWebsite?: string) => {
    const { lastFetched, isLoading, currentFetch } = get();

    // Prevent multiple simultaneous fetches
    if (isLoading) return;

    // Check if data is fresh
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) return;

    // Cancel any existing fetch
    if (currentFetch) {
      currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = vendorWebsite
        ? await getVendorSocialLinks(vendorWebsite)
        : await getSocialLinks();

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        links: result.data || [],
        isLoading: false,
        error: null,
        lastFetched: Date.now(),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      set({
        isLoading: false,
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

// Memoized selector hooks
export const useSocialLinks = () => {
  const links = useSocialLinkStore(state => state.links);
  return links;
};

export const useSocialLinkLoading = () => {
  const isLoading = useSocialLinkStore(state => state.isLoading);
  return isLoading;
};

export const useSocialLinkError = () => {
  const error = useSocialLinkStore(state => state.error);
  return error;
};

export const useSocialLinkData = (vendorWebsite?: string) => {
  const fetchLinks = useSocialLinkStore(state => state.fetchLinks);
  const reset = useSocialLinkStore(state => state.reset);

  // Use useCallback to memoize the fetch function
  const memoizedFetch = useCallback(() => {
    fetchLinks(vendorWebsite);
  }, [vendorWebsite, fetchLinks]);

  useEffect(() => {
    memoizedFetch();
    return () => {
      reset();
    };
  }, [memoizedFetch, reset]);

  const links = useSocialLinks();
  const isLoading = useSocialLinkLoading();
  const error = useSocialLinkError();

  return { links, isLoading, error };
};
