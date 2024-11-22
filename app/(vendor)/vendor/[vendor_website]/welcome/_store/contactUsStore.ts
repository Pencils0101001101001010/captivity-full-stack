"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
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

interface ContactState {
  contacts: ContactInfo[];
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
  isHydrated: boolean;
}

interface ContactActions {
  update: (id: string, data: ContactFormData) => Promise<void>;
  create: (data: ContactFormData) => Promise<void>;
  remove: (id: string) => Promise<void>;
  fetchContacts: (vendorWebsite?: string) => Promise<void>;
  setContacts: (contacts: ContactInfo[]) => void;
  setHydrated: (state: boolean) => void;
  reset: () => void;
}

type ContactStore = ContactState & ContactActions;

const CACHE_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year

const initialState: ContactState = {
  contacts: [],
  isLoading: false,
  error: null,
  lastFetched: 0,
  isHydrated: false,
};

export const useContactStore = create<ContactStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setHydrated: (state: boolean) => set({ isHydrated: state }),

      setContacts: (contacts: ContactInfo[]) => {
        set({ contacts, lastFetched: Date.now() });
      },

      reset: () => {
        const { isLoading } = get();
        if (isLoading) return;
        set(initialState);
      },

      update: async (id: string, data: ContactFormData) => {
        const { isLoading } = get();
        if (isLoading) return;

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
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await createContactInfo(data);
          if (!result.success)
            throw new Error(result.error || "Creation failed");

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
        const { isLoading } = get();
        if (isLoading) return;

        set({ isLoading: true, error: null });
        try {
          const result = await deleteContactInfo(id);
          if (!result.success)
            throw new Error(result.error || "Deletion failed");

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
        const { isLoading, lastFetched } = get();
        if (isLoading) return;

        // Check if cache is still valid
        if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
          return;
        }

        set({ isLoading: true, error: null });
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
      name: "vendor-contact-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        contacts: state.contacts,
        lastFetched: state.lastFetched,
      }),
      onRehydrateStorage: () => state => {
        state?.setHydrated(true);
      },
    }
  )
);

// Selector hooks
export const useContacts = () => useContactStore(state => state.contacts);
export const useContactLoading = () =>
  useContactStore(state => state.isLoading);
export const useContactError = () => useContactStore(state => state.error);
export const useContactHydrated = () =>
  useContactStore(state => state.isHydrated);

export const useContactData = (vendorWebsite?: string) => {
  const fetchContacts = useContactStore(state => state.fetchContacts);
  const contacts = useContacts();
  const isHydrated = useContactHydrated();
  const lastFetched = useContactStore(state => state.lastFetched);

  useEffect(() => {
    if (
      isHydrated &&
      (!contacts.length ||
        !lastFetched ||
        Date.now() - lastFetched >= CACHE_DURATION)
    ) {
      fetchContacts(vendorWebsite);
    }
  }, [isHydrated, contacts.length, lastFetched, fetchContacts, vendorWebsite]);

  return {
    contacts,
    isLoading: useContactLoading(),
    error: useContactError(),
    update: useContactStore(state => state.update),
    create: useContactStore(state => state.create),
    remove: useContactStore(state => state.remove),
  };
};
