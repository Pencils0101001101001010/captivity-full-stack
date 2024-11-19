import { create } from "zustand";
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

interface SocialLinkStore {
  links: SocialLink[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  currentFetch: AbortController | null;
  fetchLinks: () => Promise<void>;
  fetchVendorLinks: (vendorWebsite: string) => Promise<void>;
  updateLink: (id: string, data: SocialLinkFormData) => Promise<void>;
  createLink: (data: SocialLinkFormData) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  resetState: () => void;
}

export const useSocialLinkStore = create<SocialLinkStore>((set, get) => ({
  links: [],
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
      links: [],
      isLoading: false,
      error: null,
      initialized: false,
      currentFetch: null,
    });
  },

  fetchLinks: async () => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getSocialLinks();

      if (controller.signal.aborted) return;

      if (!result.success) {
        throw new Error(result.error);
      }

      set({ links: result.data || [], initialized: true });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch social links",
      });
    } finally {
      set(state => ({
        isLoading: false,
        currentFetch:
          state.currentFetch === controller ? null : state.currentFetch,
      }));
    }
  },

  fetchVendorLinks: async (vendorWebsite: string) => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getVendorSocialLinks(vendorWebsite);

      if (controller.signal.aborted) return;

      if (!result.success) {
        throw new Error(result.error);
      }

      set({ links: result.data || [], initialized: true });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor social links",
      });
    } finally {
      set(state => ({
        isLoading: false,
        currentFetch:
          state.currentFetch === controller ? null : state.currentFetch,
      }));
    }
  },

  updateLink: async (id: string, data: SocialLinkFormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await updateSocialLink(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ links: result.data || [] });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update social link",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createLink: async (data: SocialLinkFormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await createSocialLink(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ links: result.data || [] });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create social link",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteLink: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await deleteSocialLink(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ links: result.data || [] });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete social link",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export const useSocialLinkData = () => {
  const { fetchLinks, resetState, links, isLoading, error } =
    useSocialLinkStore();

  useEffect(() => {
    fetchLinks();
    return () => resetState();
  }, [fetchLinks, resetState]);

  return { links, isLoading, error };
};
