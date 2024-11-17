import { create } from "zustand";
import {
  createContactInfo,
  deleteContactInfo,
  getContactInfo,
  updateContactInfo,
} from "../_actions/contactUs-actions";

export interface ContactInfo {
  id?: string;
  city: string;
  telephone: string;
  general: string;
  websiteQueries: string;
}

interface ContactStore {
  contacts: ContactInfo[];
  isLoading: boolean;
  error: string | null;
  fetchContacts: () => Promise<void>;
  updateContact: (id: string, data: Omit<ContactInfo, "id">) => Promise<void>;
  createContact: (data: Omit<ContactInfo, "id">) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
}

export const useContactStore = create<ContactStore>(set => ({
  contacts: [],
  isLoading: false,
  error: null,

  fetchContacts: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getContactInfo();
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ contacts: result.data || [] });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch contacts",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  updateContact: async (id: string, data: Omit<ContactInfo, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const result = await updateContactInfo(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      set(state => ({
        contacts: state.contacts.map(contact =>
          contact.id === id ? { ...data, id } : contact
        ),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to update contact",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  createContact: async (data: Omit<ContactInfo, "id">) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createContactInfo(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      set(state => ({
        contacts: [...state.contacts, ...(result.data || [])],
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create contact",
      });
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
      set(state => ({
        contacts: state.contacts.filter(contact => contact.id !== id),
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to delete contact",
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
