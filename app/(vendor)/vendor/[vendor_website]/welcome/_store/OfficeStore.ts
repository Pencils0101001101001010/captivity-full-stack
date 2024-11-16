"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import {
  addOfficeLocation,
  updateOfficeLocation,
  removeOfficeLocation,
  updateContactInfo,
  getOfficeLocations,
} from "../_actions/office-actions";

interface OfficeHours {
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
}

interface Office {
  id: string;
  city: string;
  telephone: string;
  general: string;
  websiteQueries: string;
  logoUrl?: string;
  openingHours: OfficeHours | null;
}

interface ContactInfo {
  generalEmail: string;
  websiteEmail: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
}

interface OfficeState {
  offices: Office[];
  contactInfo: ContactInfo;
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
}

interface OfficeActions {
  addOffice: (formData: FormData) => Promise<void>;
  updateOffice: (officeId: string, formData: FormData) => Promise<void>;
  removeOffice: (officeId: string) => Promise<void>;
  updateContact: (contactInfo: ContactInfo) => Promise<void>;
  fetchOfficeLocations: () => Promise<void>;
}

type OfficeStore = OfficeState & OfficeActions;

const INITIAL_CONTACT_INFO: ContactInfo = {
  generalEmail: "",
  websiteEmail: "",
  socialMedia: {},
};

const INITIAL_STATE: OfficeState = {
  offices: [],
  contactInfo: INITIAL_CONTACT_INFO,
  isLoading: false,
  error: null,
  lastFetch: 0,
};

const CACHE_DURATION = 60000; // 1 minute cache
const DEBOUNCE_DELAY = 300; // 300ms debounce

export const useOfficeStore = create<OfficeStore>()(
  devtools(
    (set, get) => {
      let debounceTimer: NodeJS.Timeout | null = null;

      const shouldFetch = () => {
        const now = Date.now();
        return !get().lastFetch || now - get().lastFetch > CACHE_DURATION;
      };

      const debounce = (fn: Function) => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => fn(), DEBOUNCE_DELAY);
      };

      const setLoading = (loading: boolean) =>
        set({ isLoading: loading }, false, "setLoading");

      const setError = (error: string | null) =>
        set({ error }, false, "setError");

      const setOffices = (offices: Office[]) =>
        set({ offices, lastFetch: Date.now() }, false, "setOffices");

      const setContactInfo = (contactInfo: ContactInfo) =>
        set({ contactInfo }, false, "setContactInfo");

      return {
        ...INITIAL_STATE,

        addOffice: async (formData: FormData) => {
          setLoading(true);
          try {
            const result = await addOfficeLocation(formData);
            if (!result.success) throw new Error(result.error);
            if (result.data?.offices) setOffices(result.data.offices);
            if (result.data?.contactInfo)
              setContactInfo(result.data.contactInfo);
            setError(null);
          } catch (error) {
            setError(
              error instanceof Error ? error.message : "Failed to add office"
            );
          } finally {
            setLoading(false);
          }
        },

        updateOffice: async (officeId: string, formData: FormData) => {
          setLoading(true);
          try {
            const result = await updateOfficeLocation(officeId, formData);
            if (!result.success) throw new Error(result.error);
            const updatedOffices = get().offices.map(office =>
              office.id === officeId ? result.data!.offices[0] : office
            );
            setOffices(updatedOffices);
            if (result.data?.contactInfo)
              setContactInfo(result.data.contactInfo);
            setError(null);
          } catch (error) {
            setError(
              error instanceof Error ? error.message : "Failed to update office"
            );
          } finally {
            setLoading(false);
          }
        },

        removeOffice: async (officeId: string) => {
          setLoading(true);
          try {
            const result = await removeOfficeLocation(officeId);
            if (!result.success) throw new Error(result.error);
            if (result.data?.offices) setOffices(result.data.offices);
            if (result.data?.contactInfo)
              setContactInfo(result.data.contactInfo);
            setError(null);
          } catch (error) {
            setError(
              error instanceof Error ? error.message : "Failed to remove office"
            );
          } finally {
            setLoading(false);
          }
        },

        updateContact: async (contactInfo: ContactInfo) => {
          setLoading(true);
          try {
            const result = await updateContactInfo(contactInfo);
            if (!result.success) throw new Error(result.error);
            if (result.data?.offices) setOffices(result.data.offices);
            if (result.data?.contactInfo)
              setContactInfo(result.data.contactInfo);
            setError(null);
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to update contact info"
            );
          } finally {
            setLoading(false);
          }
        },

        fetchOfficeLocations: async () => {
          if (!shouldFetch()) return;

          const fetch = async () => {
            if (get().isLoading) return;

            setLoading(true);
            try {
              const result = await getOfficeLocations();
              if (!result.success) throw new Error(result.error);
              if (result.data?.offices) setOffices(result.data.offices);
              setContactInfo(result.data?.contactInfo || INITIAL_CONTACT_INFO);
              setError(null);
            } catch (error) {
              setError(
                error instanceof Error
                  ? error.message
                  : "Failed to fetch offices"
              );
            } finally {
              setLoading(false);
            }
          };

          debounce(fetch);
        },
      };
    },
    { name: "office-store" }
  )
);

// Selector hooks
export const useOffices = () => useOfficeStore(state => state.offices);

export const useOffice = (id: string) =>
  useOfficeStore(state => state.offices.find(office => office.id === id));

export const useContactInfo = () => useOfficeStore(state => state.contactInfo);

export const useSocialMedia = () =>
  useOfficeStore(state => state.contactInfo.socialMedia);

export const useOfficeLoading = () => useOfficeStore(state => state.isLoading);

export const useOfficeError = () => useOfficeStore(state => state.error);

export const useOfficeActions = () => {
  return {
    addOffice: useOfficeStore(state => state.addOffice),
    updateOffice: useOfficeStore(state => state.updateOffice),
    removeOffice: useOfficeStore(state => state.removeOffice),
    updateContact: useOfficeStore(state => state.updateContact),
    fetchOfficeLocations: useOfficeStore(state => state.fetchOfficeLocations),
  };
};
