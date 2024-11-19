// openingHoursStore.ts
import { create } from "zustand";
import {
  createOpeningHours,
  deleteOpeningHours,
  getOpeningHours,
  getVendorOpeningHoursBySlug,
  updateOpeningHours,
} from "../_actions/tradingHours-actions";
import { useEffect } from "react";

export interface OpeningHoursInfo {
  id: string;
  city: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
  userSettingsId: string;
}

type OpeningHoursFormData = Omit<OpeningHoursInfo, "id" | "userSettingsId">;

interface OpeningHoursStore {
  openingHours: OpeningHoursInfo[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  currentFetch: AbortController | null;
  fetchOpeningHours: () => Promise<void>;
  fetchVendorOpeningHours: (vendorWebsite: string) => Promise<void>;
  updateOpeningHour: (id: string, data: OpeningHoursFormData) => Promise<void>;
  createOpeningHour: (data: OpeningHoursFormData) => Promise<void>;
  deleteOpeningHour: (id: string) => Promise<void>;
  resetState: () => void;
}

export const useOpeningHoursStore = create<OpeningHoursStore>((set, get) => ({
  openingHours: [],
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
      openingHours: [],
      isLoading: false,
      error: null,
      initialized: false,
      currentFetch: null,
    });
  },

  fetchOpeningHours: async () => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    // Cancel any existing fetch
    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getOpeningHours();

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (!result.success) {
        throw new Error(result.error);
      }

      set({ openingHours: result.data || [], initialized: true });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch opening hours",
      });
    } finally {
      set(state => ({
        isLoading: false,
        currentFetch:
          state.currentFetch === controller ? null : state.currentFetch,
      }));
    }
  },

  fetchVendorOpeningHours: async (vendorWebsite: string) => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    // Cancel any existing fetch
    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getVendorOpeningHoursBySlug(vendorWebsite);

      // Check if request was aborted
      if (controller.signal.aborted) return;

      if (!result.success) {
        throw new Error(result.error);
      }

      set({ openingHours: result.data || [], initialized: true });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor opening hours",
      });
    } finally {
      set(state => ({
        isLoading: false,
        currentFetch:
          state.currentFetch === controller ? null : state.currentFetch,
      }));
    }
  },

  updateOpeningHour: async (id: string, data: OpeningHoursFormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await updateOpeningHours(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ openingHours: result.data });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update opening hours",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createOpeningHour: async (data: OpeningHoursFormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await createOpeningHours(data);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ openingHours: result.data });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create opening hours",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteOpeningHour: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await deleteOpeningHours(id);
      if (!result.success) {
        throw new Error(result.error);
      }
      set({ openingHours: result.data });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete opening hours",
      });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Custom hook for managing opening hours data fetching
export const useOpeningHoursData = (vendorWebsite?: string) => {
  const {
    fetchOpeningHours,
    fetchVendorOpeningHours,
    resetState,
    openingHours,
    isLoading,
    error,
  } = useOpeningHoursStore();

  useEffect(() => {
    if (vendorWebsite) {
      fetchVendorOpeningHours(vendorWebsite);
    } else {
      fetchOpeningHours();
    }

    return () => {
      resetState();
    };
  }, [vendorWebsite, fetchOpeningHours, fetchVendorOpeningHours, resetState]);

  return { openingHours, isLoading, error };
};
