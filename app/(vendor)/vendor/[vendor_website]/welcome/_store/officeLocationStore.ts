// openingHoursStore.ts
import { create } from "zustand";
import { useState, useEffect, useCallback } from "react";
import {
  createOpeningHours,
  deleteOpeningHours,
  getOpeningHours,
  updateOpeningHours,
} from "../_actions/officeLocation-actions";

export interface OpeningHoursInfo {
  id: string;
  mondayToThursday: string;
  friday: string;
  saturdaySunday: string;
  publicHolidays: string;
  officeLocationId: string;
}

type OpeningHoursFormData = Omit<OpeningHoursInfo, "id" | "officeLocationId">;

interface OpeningHoursStore {
  openingHours: OpeningHoursInfo[];
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  currentFetch: AbortController | null;
  fetchOpeningHours: (officeLocationId: string) => Promise<void>;
  updateOpeningHours: (id: string, data: OpeningHoursFormData) => Promise<void>;
  createOpeningHours: (
    officeLocationId: string,
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

  fetchOpeningHours: async (officeLocationId: string) => {
    const state = get();
    if (state.isLoading || state.initialized) return;

    // Cancel any existing fetch
    if (state.currentFetch) {
      state.currentFetch.abort();
    }

    const controller = new AbortController();
    set({ currentFetch: controller, isLoading: true, error: null });

    try {
      const result = await getOpeningHours(officeLocationId);

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

  updateOpeningHours: async (id: string, data: OpeningHoursFormData) => {
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

  createOpeningHours: async (
    officeLocationId: string,
    data: OpeningHoursFormData
  ) => {
    set({ isLoading: true, error: null });

    try {
      const result = await createOpeningHours(officeLocationId, data);
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

  deleteOpeningHours: async (id: string) => {
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
export const useOpeningHoursData = (officeLocationId: string) => {
  const { fetchOpeningHours, resetState, openingHours, isLoading, error } =
    useOpeningHoursStore();

  useEffect(() => {
    if (officeLocationId) {
      fetchOpeningHours(officeLocationId);
    }

    return () => {
      resetState();
    };
  }, [officeLocationId, fetchOpeningHours, resetState]);

  return { openingHours, isLoading, error };
};
