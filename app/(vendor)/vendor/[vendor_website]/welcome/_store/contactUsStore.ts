// contactUsStore.ts
import { create } from "zustand";
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
  initialized: boolean;
  fetchContacts: () => Promise<void>;
  fetchVendorContacts: (vendorWebsite: string) => Promise<void>;
  updateContact: (id: string, data: ContactFormData) => Promise<void>;
  createContact: (data: ContactFormData) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

export const useContactStore = create<ContactStore>(set => ({
  contacts: [],
  isLoading: false,
  error: null,
  initialized: false,

  fetchContacts: async () => {
    set(state => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const result = await getContactInfo();

      if (!result.success) {
        throw new Error(result.error);
      }

      set({ contacts: result.data || [], initialized: true });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch contacts",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchVendorContacts: async (vendorWebsite: string) => {
    set(state => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

    try {
      const result = await getVendorContactsBySlug(vendorWebsite);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ contacts: result.data || [], initialized: true });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor contacts",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateContact: async (id: string, data: ContactFormData) => {
    set(state => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

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
    set(state => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

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
    set(state => {
      if (state.isLoading) return state;
      return { ...state, isLoading: true, error: null };
    });

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
