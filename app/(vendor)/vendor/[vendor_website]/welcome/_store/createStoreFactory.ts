// _store/storeFactory.ts
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

const DEFAULT_CACHE_DURATION = 60000; // 1 minute
const DEFAULT_DEBOUNCE_DELAY = 300; // 300ms

export const createStoreFactory = <T extends BaseItem>({
  name,
  cacheDuration = DEFAULT_CACHE_DURATION,
  debounceDelay = DEFAULT_DEBOUNCE_DELAY,
  api,
}: StoreConfig<T>) => {
  type Store = StoreState<T> & StoreActions<T>;

  let debounceTimer: NodeJS.Timeout | null = null;

  const useStore = create<Store>((set, get) => {
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

    return {
      // Initial state
      items: [],
      isLoading: false,
      error: null,
      lastFetch: 0,
      initialized: false,
      currentFetch: null,

      resetState: () => {
        const { currentFetch } = get();
        if (currentFetch) {
          currentFetch.abort();
        }
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
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
          });
        } catch (error) {
          console.error(`Error uploading ${name}:`, error);
          updateState({
            isLoading: false,
            error: error instanceof Error ? error.message : `Upload failed`,
          });
          throw error;
        }
      },

      remove: async (url: string) => {
        const state = get();
        if (state.isLoading) return;

        // Optimistic update
        const previousItems = state.items;
        updateState({
          items: state.items.filter(item => item.url !== url),
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
          });
        } catch (error) {
          // Revert on error
          updateState({
            items: previousItems,
            isLoading: false,
            error: error instanceof Error ? error.message : `Remove failed`,
          });
          throw error;
        }
      },

      fetch: async () => {
        if (!shouldFetch()) return;

        const fetch = async () => {
          const state = get();
          if (state.isLoading) return;

          if (state.currentFetch) {
            state.currentFetch.abort();
          }

          const controller = new AbortController();
          updateState({
            currentFetch: controller,
            isLoading: true,
            error: null,
          });

          try {
            const result = await api.getAll();

            if (controller.signal.aborted) return;

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
              error: error instanceof Error ? error.message : `Fetch failed`,
              currentFetch: null,
            });
          }
        };

        debounce(fetch);
      },

      fetchBySlug: async (slug: string) => {
        if (!shouldFetch()) return;

        const fetch = async () => {
          const state = get();
          if (state.isLoading) return;

          if (state.currentFetch) {
            state.currentFetch.abort();
          }

          const controller = new AbortController();
          updateState({
            currentFetch: controller,
            isLoading: true,
            error: null,
          });

          try {
            const result = await api.getBySlug(slug);

            if (controller.signal.aborted) return;

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
              error: error instanceof Error ? error.message : `Fetch failed`,
              currentFetch: null,
            });
          }
        };

        debounce(fetch);
      },
    };
  });

  return {
    useStore,
    useItems: () => useStore(state => state.items),
    useLoading: () => useStore(state => state.isLoading),
    useError: () => useStore(state => state.error),
    useData: (storeSlug?: string) => {
      const store = useStore();
      const items = useStore(state => state.items);
      const isLoading = useStore(state => state.isLoading);
      const error = useStore(state => state.error);

      useEffect(() => {
        if (storeSlug) {
          store.fetchBySlug(storeSlug);
        } else {
          store.fetch();
        }

        return () => {
          store.resetState();
        };
      }, [storeSlug, store]);

      return { items, isLoading, error };
    },
  };
};
