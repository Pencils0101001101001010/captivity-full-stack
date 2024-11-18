"use client";

import { create } from "zustand";
import { useEffect } from "react";

interface BaseItem {
  url: string;
}

interface StoreState<T extends BaseItem> {
  items: T[];
  isLoading: boolean;
  error: string | null;
  lastFetch: number;
  initialized: boolean;
  currentFetch: AbortController | null;
}

interface StoreActions<T extends BaseItem> {
  upload: (formData: FormData) => Promise<void>;
  remove: (url: string) => Promise<void>;
  fetch: () => Promise<void>;
  fetchBySlug: (slug: string) => Promise<void>;
  resetState: () => void;
}

interface ApiResponse<T extends BaseItem> {
  success: boolean;
  error?: string;
  items: T[];
}

interface StoreConfig<T extends BaseItem> {
  name: string;
  cacheDuration?: number;
  debounceDelay?: number;
  api: {
    upload: (formData: FormData) => Promise<ApiResponse<T>>;
    remove: (url: string) => Promise<ApiResponse<T>>;
    getAll: () => Promise<ApiResponse<T>>;
    getBySlug: (slug: string) => Promise<ApiResponse<T>>;
  };
}

interface UseStoreDataReturn<T extends BaseItem> {
  items: T[];
  isLoading: boolean;
  error: string | null;
}

interface StoreFactoryReturn<T extends BaseItem> {
  useStore: () => StoreState<T> & StoreActions<T>;
  useItems: () => T[];
  useLoading: () => boolean;
  useError: () => string | null;
  useData: (storeSlug?: string) => UseStoreDataReturn<T>;
}

const DEFAULT_CACHE_DURATION = 60000; // 1 minute
const DEFAULT_DEBOUNCE_DELAY = 300; // 300ms

export const createStoreFactory = <T extends BaseItem>({
  name,
  cacheDuration = DEFAULT_CACHE_DURATION,
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
  api,
}: StoreConfig<T>): StoreFactoryReturn<T> => {
  type Store = StoreState<T> & StoreActions<T>;

  let debounceTimer: NodeJS.Timeout | null = null;
  let activeController: AbortController | null = null;

  const store = create<Store>((set, get) => {
    const shouldFetch = () => {
      const now = Date.now();
      const state = get();
      return (
        !state.initialized ||
        !state.lastFetch ||
        now - state.lastFetch > cacheDuration
      );
    };

    const debounce = (fn: Function) => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fn(), debounceDelay);
    };

    const updateState = (updates: Partial<StoreState<T>>) => {
      set(state => ({
        ...state,
        ...updates,
        lastFetch: updates.items ? Date.now() : state.lastFetch,
      }));
    };

    const cleanupFetch = () => {
      if (activeController) {
        activeController.abort();
        activeController = null;
      }
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
    };

    return {
      // Initial state
      items: [],
      isLoading: false,
      error: null,
      lastFetch: 0,
      initialized: false,
      currentFetch: null,

      resetState: () => {
        cleanupFetch();
        set({
          items: [],
          isLoading: false,
          error: null,
          lastFetch: 0,
          initialized: false,
          currentFetch: null,
        });
      },

      upload: async (formData: FormData) => {
        if (get().isLoading) return;

        updateState({ isLoading: true, error: null });
        try {
          const result = await api.upload(formData);
          if (!result.success) throw new Error(result.error);
          updateState({
            isLoading: false,
            items: result.items,
            error: null,
            initialized: true,
          });
        } catch (error) {
          updateState({
            isLoading: false,
            error: error instanceof Error ? error.message : "Upload failed",
          });
          throw error;
        }
      },

      remove: async (url: string) => {
        if (get().isLoading) return;

        const previousItems = get().items;
        updateState({
          items: previousItems.filter(item => item.url !== url),
          isLoading: true,
          error: null,
        });

        try {
          const result = await api.remove(url);
          if (!result.success) throw new Error(result.error);
          updateState({
            isLoading: false,
            items: result.items,
            error: null,
            initialized: true,
          });
        } catch (error) {
          updateState({
            items: previousItems,
            isLoading: false,
            error: error instanceof Error ? error.message : "Remove failed",
          });
          throw error;
        }
      },

      fetch: async () => {
        if (!shouldFetch()) return;
        if (get().isLoading) return;

        cleanupFetch();
        activeController = new AbortController();

        updateState({
          currentFetch: activeController,
          isLoading: true,
          error: null,
        });

        try {
          const result = await api.getAll();
          if (activeController?.signal.aborted) return;

          if (!result.success) throw new Error(result.error);
          updateState({
            items: result.items,
            isLoading: false,
            initialized: true,
            currentFetch: null,
            error: null,
          });
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
          console.error(`Error fetching ${name}:`, error);
          updateState({
            isLoading: false,
            error: error instanceof Error ? error.message : "Fetch failed",
            currentFetch: null,
          });
        }
      },

      fetchBySlug: async (slug: string) => {
        if (!shouldFetch()) return;
        if (get().isLoading) return;

        cleanupFetch();
        activeController = new AbortController();

        updateState({
          currentFetch: activeController,
          isLoading: true,
          error: null,
        });

        try {
          const result = await api.getBySlug(slug);
          if (activeController?.signal.aborted) return;

          if (!result.success) throw new Error(result.error);
          updateState({
            items: result.items,
            isLoading: false,
            initialized: true,
            currentFetch: null,
            error: null,
          });
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") return;
          console.error(`Error fetching ${name} by slug:`, error);
          updateState({
            isLoading: false,
            error: error instanceof Error ? error.message : "Fetch failed",
            currentFetch: null,
          });
        }
      },
    };
  });

  const useData = (storeSlug?: string): UseStoreDataReturn<T> => {
    const state = store();

    useEffect(() => {
      let mounted = true;

      const fetchData = async () => {
        if (!mounted) return;

        try {
          if (storeSlug) {
            await state.fetchBySlug(storeSlug);
          } else {
            await state.fetch();
          }
        } catch (error) {
          // Error handling is done in the store actions
        }
      };

      fetchData();

      return () => {
        mounted = false;
        state.resetState();
      };
    }, [storeSlug, state]);

    return {
      items: state.items,
      isLoading: state.isLoading,
      error: state.error,
    };
  };

  return {
    useStore: () => store(),
    useItems: () => store(state => state.items),
    useLoading: () => store(state => state.isLoading),
    useError: () => store(state => state.error),
    useData,
  };
};
