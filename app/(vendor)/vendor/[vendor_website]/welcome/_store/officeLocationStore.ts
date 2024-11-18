// openingHoursStore.ts
import { create } from "zustand";
import {
  getOpeningHours,
  createOpeningHours as createHours,
  updateOpeningHours as updateHours,
  deleteOpeningHours as deleteHours,
  OpeningHoursInfo,
  OpeningHoursFormData as FormData,
} from "../_actions/officeLocation-actions";
import React from "react";

// Re-export the types from the actions file
export type { OpeningHoursInfo };
export type OpeningHoursFormData = FormData;

interface OpeningHoursStore {
  openingHours: OpeningHoursInfo[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  currentFetch: AbortController | null;
  fetchOpeningHours: (vendorWebsite: string) => Promise<void>;
  updateOpeningHours: (id: string, data: OpeningHoursFormData) => Promise<void>;
  createOpeningHours: (
    vendorWebsite: string,
    data: OpeningHoursFormData
  ) => Promise<void>;
  deleteOpeningHours: (id: string) => Promise<void>;
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

  fetchOpeningHours: async (vendorWebsite: string) => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getOpeningHours(vendorWebsite);

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

  updateOpeningHours: async (id: string, data: OpeningHoursFormData) => {
    set({ isLoading: true, error: null });

    try {
      const result = await updateHours(id, data);
      if (!result.success) {
        throw new Error(result.error);
      }

      set({ openingHours: result.data || [] });
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

  createOpeningHours: async (
    vendorWebsite: string,
    data: OpeningHoursFormData
  ) => {
    set({ isLoading: true, error: null });

    try {
      const result = await createHours(vendorWebsite, data);
      if (!result.success) {
        throw new Error(result.error);
      }

      set({ openingHours: result.data || [] });
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

  deleteOpeningHours: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await deleteHours(id);
      if (!result.success) {
        throw new Error(result.error);
      }

      set({ openingHours: result.data || [] });
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
export const useOpeningHoursData = (vendorWebsite: string) => {
  const {
    openingHours,
    isLoading,
    error,
    fetchOpeningHours,
    createOpeningHours,
    updateOpeningHours,
    deleteOpeningHours,
    resetState,
  } = useOpeningHoursStore();

  React.useEffect(() => {
    if (vendorWebsite) {
      fetchOpeningHours(vendorWebsite);
    }
    return () => {
      resetState();
    };
  }, [vendorWebsite, fetchOpeningHours, resetState]);

  return {
    openingHours,
    isLoading,
    error,
    createOpeningHours,
    updateOpeningHours,
    deleteOpeningHours,
  };
};
