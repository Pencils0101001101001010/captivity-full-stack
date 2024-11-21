"use client";

import { create } from "zustand";
import { useCallback, useEffect } from "react";
import {
  getContactInfo,
  updateContactInfo,
  createContactInfo,
  deleteContactInfo,
  getVendorContactsBySlug,
} from "../_actions/contactUs-actions";

export interface ContactInfo {
  id: string;
  city: string;
  telephone: string;
  general: string;
  websiteQueries: string;
  userSettingsId: string;
}

type ContactFormData = Omit<ContactInfo, "id" | "userSettingsId">;

interface ContactStore {
  contacts: ContactInfo[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  currentFetch: AbortController | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const useContactStore = create<
  ContactStore & {
    update: (id: string, data: ContactFormData) => Promise<void>;
    create: (data: ContactFormData) => Promise<void>;
    remove: (id: string) => Promise<void>;
    fetchContacts: (vendorWebsite?: string) => Promise<void>;
    reset: () => void;
  }
>((set, get) => ({
  contacts: [],
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
      contacts: [],
      isLoading: false,
      error: null,
      lastFetched: 0,
      currentFetch: null,
    });
  },

  update: async (id: string, data: ContactFormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateContactInfo(id, data);
      if (!result.success) throw new Error(result.error || "Update failed");

      set({
        contacts: result.data,
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

  create: async (data: ContactFormData) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createContactInfo(data);
      if (!result.success) throw new Error(result.error || "Creation failed");

      set({
        contacts: result.data,
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
      const result = await deleteContactInfo(id);
      if (!result.success) throw new Error(result.error || "Deletion failed");

      set({
        contacts: result.data,
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

  fetchContacts: async (vendorWebsite?: string) => {
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
        ? await getVendorContactsBySlug(vendorWebsite)
        : await getContactInfo();

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        contacts: result.data || [],
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
export const useContacts = () => {
  const contacts = useContactStore(state => state.contacts);
  return contacts;
};

export const useContactLoading = () => {
  const isLoading = useContactStore(state => state.isLoading);
  return isLoading;
};

export const useContactError = () => {
  const error = useContactStore(state => state.error);
  return error;
};

export const useContactData = (vendorWebsite?: string) => {
  const fetchContacts = useContactStore(state => state.fetchContacts);
  const reset = useContactStore(state => state.reset);

  // Use useCallback to memoize the fetch function
  const memoizedFetch = useCallback(() => {
    fetchContacts(vendorWebsite);
  }, [vendorWebsite, fetchContacts]);

  useEffect(() => {
    memoizedFetch();
    return () => {
      reset();
    };
  }, [memoizedFetch, reset]);

  const contacts = useContacts();
  const isLoading = useContactLoading();
  const error = useContactError();

  return { contacts, isLoading, error };
};
