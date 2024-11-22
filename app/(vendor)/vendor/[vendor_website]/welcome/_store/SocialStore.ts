"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect } from "react";
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

interface SocialLinkState {
  links: SocialLink[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  isHydrated: boolean;
}

interface SocialLinkActions {
  update: (id: string, data: SocialLinkFormData) => Promise<void>;
  create: (data: SocialLinkFormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  fetchLinks: (vendorWebsite?: string) => Promise<void>;
  setLinks: (links: SocialLink[]) => void;
  setHydrated: (state: boolean) => void;
  reset: () => void;
}

type SocialLinkStore = SocialLinkState & SocialLinkActions;

const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year

const initialState: SocialLinkState = {
  links: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
  isHydrated: false,
};

export const useSocialLinkStore = create<SocialLinkStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      setLinks: (links: SocialLink[]) => {
        set({ links, lastFetched: Date.now() });
      },

      reset: () => {
        const { isLoading } = get();
        if (isLoading) return;
        set(initialState);
      },

      update: async (id: string, data: SocialLinkFormData) => {
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await updateSocialLink(id, data);
          if (!result.success) throw new Error(result.error || "Update failed");

          set({
            links: result.data,
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
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await createSocialLink(data);
          if (!result.success)
            throw new Error(result.error || "Creation failed");

          set({
            links: result.data,
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
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await deleteSocialLink(id);
          if (!result.success)
            throw new Error(result.error || "Deletion failed");

          set({
            links: result.data,
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
        const { isLoading, lastFetched } = get();
        if (isLoading) return;

        // Check if cache is still valid
        if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const result = vendorWebsite
            ? await getVendorSocialLinks(vendorWebsite)
            : await getSocialLinks();

          if (!result.success) throw new Error(result.error || "Fetch failed");

          set({
            links: result.data || [],
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
    }),
    {
      name: "vendor-social-link-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        links: state.links,
        lastFetched: state.lastFetched,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selector hooks
export const useSocialLinks = () => useSocialLinkStore(state => state.links);
export const useSocialLinkLoading = () =>
  useSocialLinkStore(state => state.isLoading);
export const useSocialLinkError = () =>
  useSocialLinkStore(state => state.error);
export const useSocialLinkHydrated = () =>
  useSocialLinkStore(state => state.isHydrated);

export const useSocialLinkData = (vendorWebsite?: string) => {
  const fetchLinks = useSocialLinkStore(state => state.fetchLinks);
  const links = useSocialLinks();
  const isHydrated = useSocialLinkHydrated();
  const lastFetched = useSocialLinkStore(state => state.lastFetched);

  useEffect(() => {
    if (
      isHydrated &&
      (!links.length ||
        !lastFetched ||
        Date.now() - lastFetched >= CACHE_DURATION)
    ) {
      fetchLinks(vendorWebsite);
    }
  }, [isHydrated, links.length, lastFetched, fetchLinks, vendorWebsite]);

  return {
    links,
    isLoading: useSocialLinkLoading(),
    error: useSocialLinkError(),
    update: useSocialLinkStore(state => state.update),
    create: useSocialLinkStore(state => state.create),
    remove: useSocialLinkStore(state => state.remove),
  };
};
