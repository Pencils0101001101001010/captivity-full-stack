"use client";

import { create } from "zustand";
import { useEffect, useCallback, useMemo, useRef } from "react";

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

type Store<T extends BaseItem> = StoreState<T> & StoreActions<T>;

interface StoreFactoryReturn<T extends BaseItem> {
  useStore: {
    (): Store<T>;
    <U>(selector: (state: Store<T>) => U): U;
    <U>(
      selector: (state: Store<T>) => U,
      equalityFn: (a: U, b: U) => boolean
    ): U;
  };
  useItems: () => T[];
  useLoading: () => boolean;
  useError: () => string | null;
  useData: (storeSlug?: string) => UseStoreDataReturn<T>;
}

const DEFAULT_CACHE_DURATION = 60000;
const DEFAULT_DEBOUNCE_DELAY = 300;

export const createStoreFactory = <T extends BaseItem>({
  name,
  cacheDuration = DEFAULT_CACHE_DURATION,
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
  api,
}: StoreConfig<T>): StoreFactoryReturn<T> => {
  const debounceTimerRef = { current: null as NodeJS.Timeout | null };
  const activeControllerRef = { current: null as AbortController | null };

  const store = create<Store<T>>((set, get) => {
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
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => fn(), debounceDelay);
    };

    const updateState = (updates: Partial<StoreState<T>>) => {
      set(state => ({
        ...state,
        ...updates,
        lastFetch: updates.items ? Date.now() : state.lastFetch,
      }));
    };

    const cleanupFetch = () => {
      if (activeControllerRef.current) {
        activeControllerRef.current.abort();
        activeControllerRef.current = null;
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
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
        const state = get();
        if (state.isLoading) return;

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
        const state = get();
        if (state.isLoading) return;

        const previousItems = state.items;
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
        if (!shouldFetch() || get().isLoading) return;

        cleanupFetch();
        activeControllerRef.current = new AbortController();

        updateState({
          currentFetch: activeControllerRef.current,
          isLoading: true,
          error: null,
        });

        try {
          const result = await api.getAll();
          if (activeControllerRef.current?.signal.aborted) return;

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
        if (!shouldFetch() || get().isLoading) return;

        cleanupFetch();
        activeControllerRef.current = new AbortController();

        updateState({
          currentFetch: activeControllerRef.current,
          isLoading: true,
          error: null,
        });

        try {
          const result = await api.getBySlug(slug);
          if (activeControllerRef.current?.signal.aborted) return;

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
    const mountedRef = useRef(true);
    const slugRef = useRef(storeSlug);

    const selector = useCallback(
      (state: Store<T>) => ({
        items: state.items,
        isLoading: state.isLoading,
        error: state.error,
      }),
      []
    );

    const state = store(selector);

    const actions = useMemo(
      () => ({
        fetch: store.getState().fetch,
        fetchBySlug: store.getState().fetchBySlug,
        resetState: store.getState().resetState,
      }),
      []
    );

    useEffect(() => {
      mountedRef.current = true;
      slugRef.current = storeSlug;

      const fetchData = async () => {
        if (!mountedRef.current) return;

        try {
          if (slugRef.current) {
            await actions.fetchBySlug(slugRef.current);
          } else {
            await actions.fetch();
          }
        } catch (error) {
          // Error handling is done in the store actions
        }
      };

      fetchData();

      return () => {
        mountedRef.current = false;
        actions.resetState();
      };
    }, [storeSlug, actions]);

    return state;
  };

  return {
    useStore: store,
    useItems: () => store(state => state.items),
    useLoading: () => store(state => state.isLoading),
    useError: () => store(state => state.error),
    useData,
  };
};
