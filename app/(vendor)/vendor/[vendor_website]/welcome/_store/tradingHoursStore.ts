"use client";

import { create } from "zustand";
import {
  createOpeningHours,
  deleteOpeningHours,
  getOpeningHours,
  getVendorOpeningHoursBySlug,
  updateOpeningHours,
} from "../_actions/tradingHours-actions";
import React from "react";

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
  isFetching: boolean;
}

const initialState = {
  openingHours: [],
  isLoading: false,
  error: null,
  initialized: false,
  isFetching: false,
};

export const useOpeningHoursStore = create<
  OpeningHoursStore & {
    updateOpeningHour: (
      id: string,
      data: OpeningHoursFormData
    ) => Promise<void>;
    createOpeningHour: (data: OpeningHoursFormData) => Promise<void>;
    deleteOpeningHour: (id: string) => Promise<void>;
    fetchOpeningHours: () => Promise<void>;
    fetchVendorOpeningHours: (vendorWebsite: string) => Promise<void>;
    reset: () => void;
  }
>((set, get) => ({
  ...initialState,

  reset: () => {
    const { isLoading, isFetching } = get();
    if (isLoading || isFetching) return;
    set(initialState);
  },

  fetchOpeningHours: async () => {
    const { isFetching, initialized } = get();
    if (isFetching || initialized) return;

    set({ isFetching: true, isLoading: true, error: null });

    try {
      const result = await getOpeningHours();
      if (!result.success) throw new Error(result.error);

      set({
        openingHours: result.data || [],
        initialized: true,
        isLoading: false,
        isFetching: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch opening hours",
        isLoading: false,
        isFetching: false,
      });
    }
  },

  fetchVendorOpeningHours: async (vendorWebsite: string) => {
    const { isFetching, initialized } = get();
    if (isFetching || initialized) return;

    set({ isFetching: true, isLoading: true, error: null });

    try {
      const result = await getVendorOpeningHoursBySlug(vendorWebsite);
      if (!result.success) throw new Error(result.error);

      set({
        openingHours: result.data || [],
        initialized: true,
        isLoading: false,
        isFetching: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch vendor opening hours",
        isLoading: false,
        isFetching: false,
      });
    }
  },

  updateOpeningHour: async (id: string, data: OpeningHoursFormData) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await updateOpeningHours(id, data);
      if (!result.success) throw new Error(result.error);

      set({
        openingHours: result.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to update opening hours",
        isLoading: false,
      });
      throw error;
    }
  },

  createOpeningHour: async (data: OpeningHoursFormData) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await createOpeningHours(data);
      if (!result.success) throw new Error(result.error);

      set({
        openingHours: result.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to create opening hours",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteOpeningHour: async (id: string) => {
    const { isLoading } = get();
    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const result = await deleteOpeningHours(id);
      if (!result.success) throw new Error(result.error);

      set({
        openingHours: result.data,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete opening hours",
        isLoading: false,
      });
      throw error;
    }
  },
}));

export const useOpeningHoursData = (vendorWebsite?: string) => {
  const openingHours = useOpeningHoursStore(state => state.openingHours);
  const isLoading = useOpeningHoursStore(
    state => state.isLoading || state.isFetching
  );
  const error = useOpeningHoursStore(state => state.error);
  const initialized = useOpeningHoursStore(state => state.initialized);
  const fetchOpeningHours = useOpeningHoursStore(
    state => state.fetchOpeningHours
  );
  const fetchVendorOpeningHours = useOpeningHoursStore(
    state => state.fetchVendorOpeningHours
  );
  const reset = useOpeningHoursStore(state => state.reset);

  React.useEffect(() => {
    if (!initialized) {
      if (vendorWebsite) {
        fetchVendorOpeningHours(vendorWebsite);
      } else {
        fetchOpeningHours();
      }
    }

    return () => {
      if (vendorWebsite) {
        reset();
      }
    };
  }, [
    vendorWebsite,
    initialized,
    fetchOpeningHours,
    fetchVendorOpeningHours,
    reset,
  ]);

  return {
    openingHours,
    isLoading,
    error,
    initialized,
    fetchOpeningHours,
    fetchVendorOpeningHours,
    updateOpeningHour: useOpeningHoursStore(state => state.updateOpeningHour),
    createOpeningHour: useOpeningHoursStore(state => state.createOpeningHour),
    deleteOpeningHour: useOpeningHoursStore(state => state.deleteOpeningHour),
  };
};
