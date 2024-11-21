"use client";

import { create } from "zustand";
import { useEffect } from "react";
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
  isFetching: boolean;
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
  isFetching: false,

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
      isFetching: false,
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
    const { lastFetched, isFetching } = get();

    // Prevent multiple fetches
    if (isFetching) return;

    // Check cache
    if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
      return;
    }

    set({ isFetching: true, isLoading: true, error: null });

    try {
      const result = vendorWebsite
        ? await getVendorContactsBySlug(vendorWebsite)
        : await getContactInfo();

      if (!result.success) throw new Error(result.error || "Fetch failed");

      set({
        contacts: result.data || [],
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
}));

export const useContactData = (vendorWebsite?: string) => {
  const fetchContacts = useContactStore(state => state.fetchContacts);
  const contacts = useContactStore(state => state.contacts);
  const isLoading = useContactStore(state => state.isLoading);
  const error = useContactStore(state => state.error);
  const lastFetched = useContactStore(state => state.lastFetched);

  useEffect(() => {
    // Only fetch if we haven't fetched before or cache is expired
    if (!lastFetched || Date.now() - lastFetched >= CACHE_DURATION) {
      fetchContacts(vendorWebsite);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorWebsite]); // Only re-run if vendorWebsite changes

  return { contacts, isLoading, error };
};
