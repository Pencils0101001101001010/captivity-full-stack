import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { useEffect, useRef, useCallback } from "react";
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
  isFetching: boolean;
  update: (id: string, data: SocialLinkFormData) => Promise<void>;
  create: (data: SocialLinkFormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  fetchLinks: (vendorWebsite?: string) => Promise<void>;
  reset: () => void;
}

type SocialLinkStorePersist = Pick<SocialLinkStore, "links" | "lastFetched">;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const persistOptions: PersistOptions<SocialLinkStore, SocialLinkStorePersist> =
  {
    name: "social-link-store",
    partialize: state => ({
      links: state.links,
      lastFetched: state.lastFetched,
    }),
  };

const initialState = {
  links: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
  isFetching: false,
};

export const useSocialLinkStore = create<SocialLinkStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      reset: () => {
        const currentState = get();
        if (currentState.isFetching || currentState.isLoading) {
          return;
        }
        set(initialState);
      },

      update: async (id: string, data: SocialLinkFormData) => {
        if (get().isLoading) return;
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
        if (get().isLoading) return;
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
        if (get().isLoading) return;
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
        const { lastFetched, isFetching, isLoading } = get();

        if (isFetching || isLoading) return;
        if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
          return;
        }

        set({ isFetching: true, isLoading: true, error: null });

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
            isFetching: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Fetch failed",
            isFetching: false,
          });
        }
      },
    }),
    persistOptions
  )
);

export const useSocialLinkData = (vendorWebsite?: string) => {
  const fetchLinks = useSocialLinkStore(state => state.fetchLinks);
  const lastFetched = useSocialLinkStore(state => state.lastFetched);
  const links = useSocialLinkStore(state => state.links);
  const isLoading = useSocialLinkStore(state => state.isLoading);
  const isFetching = useSocialLinkStore(state => state.isFetching);
  const error = useSocialLinkStore(state => state.error);
  const mountedRef = useRef(false);

  const checkAndFetchData = useCallback(() => {
    if (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION) {
      fetchLinks(vendorWebsite);
    }
  }, [fetchLinks, lastFetched, vendorWebsite]);

  useEffect(() => {
    mountedRef.current = true;
    checkAndFetchData();

    return () => {
      mountedRef.current = false;
    };
  }, [checkAndFetchData]);

  return {
    links,
    isLoading: isLoading || isFetching,
    error,
  };
};
