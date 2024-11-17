// contactUsStore.ts
import { create } from "zustand";
import {
  getContactInfo,
  updateContactInfo,
  createContactInfo,
  deleteContactInfo,
  getVendorContactsBySlug,
} from "../_actions/contactUs-actions";
import { useState, useEffect, useCallback } from "react";

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
  initialized: boolean;
  currentFetch: AbortController | null;
  fetchContacts: () => Promise<void>;
  fetchVendorContacts: (vendorWebsite: string) => Promise<void>;
  updateContact: (id: string, data: ContactFormData) => Promise<void>;
  createContact: (data: ContactFormData) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  resetState: () => void;
}

export const useContactStore = create<ContactStore>((set, get) => ({
  contacts: [],
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
      contacts: [],
      isLoading: false,
      error: null,
      initialized: false,
      currentFetch: null,
    });
  },

  fetchContacts: async () => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    // Cancel any existing fetch
    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getContactInfo();

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (!result.success) {
        throw new Error(result.error);
      }

      set({ contacts: result.data || [], initialized: true });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch contacts",
      });
    } finally {
      set(state => ({
        isLoading: false,
        currentFetch:
          state.currentFetch === controller ? null : state.currentFetch,
      }));
    }
  },

  fetchVendorContacts: async (vendorWebsite: string) => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    // Cancel any existing fetch
    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getVendorContactsBySlug(vendorWebsite);

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (!result.success) {
        throw new Error(result.error);
      }

      set({ contacts: result.data || [], initialized: true });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor contacts",
      });
    } finally {
      set(state => ({
        isLoading: false,
        currentFetch:
          state.currentFetch === controller ? null : state.currentFetch,
      }));
    }
  },

  updateContact: async (id: string, data: ContactFormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await updateContactInfo(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ contacts: result.data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update contact",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createContact: async (data: ContactFormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await createContactInfo(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ contacts: result.data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create contact",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteContact: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await deleteContactInfo(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ contacts: result.data });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete contact",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Custom hook for managing contact data fetching
export const useContactData = (vendorWebsite?: string) => {
  const {
    fetchContacts,
    fetchVendorContacts,
    resetState,
    contacts,
    isLoading,
    error,
  } = useContactStore();

  useEffect(() => {
    if (vendorWebsite) {
      fetchVendorContacts(vendorWebsite);
    } else {
      fetchContacts();
    }

    return () => {
      resetState();
    };
  }, [vendorWebsite, fetchContacts, fetchVendorContacts, resetState]);

  return { contacts, isLoading, error };
};
