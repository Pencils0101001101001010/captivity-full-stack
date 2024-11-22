import { create } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { useCallback, useEffect } from "react";
import {
  uploadLogo,
  removeLogo,
  getLogo,
  getVendorLogoBySlug,
  type LogoActionResult,
} from "@/app/(vendor)/actions";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface LogoState {
  logoUrl: string | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: number;
}

interface LogoActions {
  upload: (formData: FormData) => Promise<void>;
  remove: () => Promise<void>;
  fetchLogo: (vendorWebsite?: string) => Promise<void>;
  setLogo: (url: string | null) => void;
}

type LogoStore = LogoState & LogoActions;
type LogoStorePersist = Pick<LogoStore, "logoUrl" | "lastFetched">;

const persistOptions: PersistOptions<LogoStore, LogoStorePersist> = {
  name: "vendor-logo-storage",
  storage: createJSONStorage(() => localStorage),
  partialize: state => ({
    logoUrl: state.logoUrl,
    lastFetched: state.lastFetched,
  }),
};

export const useLogoStore = create<LogoStore>()(
  persist(
    (set, get) => ({
      logoUrl: null,
      isLoading: false,
      error: null,
      lastFetched: 0,

      setLogo: (url: string | null) => {
        set({ logoUrl: url, lastFetched: Date.now() });
      },

      upload: async (formData: FormData) => {
        set({ isLoading: true, error: null });
        try {
          const result = await uploadLogo(formData);
          if (!result.success) throw new Error(result.error || "Upload failed");

          set({
            logoUrl: result.url || null,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Upload failed",
          });
          throw error;
        }
      },

      remove: async () => {
        set({ isLoading: true, error: null });
        try {
          const result = await removeLogo();
          if (!result.success) throw new Error(result.error || "Remove failed");

          set({
            logoUrl: null,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Remove failed",
          });
          throw error;
        }
      },

      fetchLogo: async (vendorWebsite?: string) => {
        const { lastFetched, isLoading } = get();

        // Don't fetch if already loading
        if (isLoading) return;

        // Check cache
        if (lastFetched && Date.now() - lastFetched < CACHE_DURATION) {
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const result = vendorWebsite
            ? await getVendorLogoBySlug(vendorWebsite)
            : await getLogo();

          if (!result.success) throw new Error(result.error || "Fetch failed");

          set({
            logoUrl: result.url || null,
            isLoading: false,
            error: null,
            lastFetched: Date.now(),
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : "Fetch failed",
          });
        }
      },
    }),
    persistOptions
  )
);

// Selector hooks for better performance
export const useLogo = () => useLogoStore(state => state.logoUrl);
export const useLogoLoading = () => useLogoStore(state => state.isLoading);
export const useLogoError = () => useLogoStore(state => state.error);

export const useLogoData = (vendorWebsite?: string) => {
  const fetchLogo = useLogoStore(state => state.fetchLogo);
  const lastFetched = useLogoStore(state => state.lastFetched);
  const logoUrl = useLogo();

  useEffect(() => {
    // Only fetch if we don't have a logo or cache is expired
    if (
      !logoUrl ||
      !lastFetched ||
      Date.now() - lastFetched >= CACHE_DURATION
    ) {
      fetchLogo(vendorWebsite);
    }
  }, [fetchLogo, lastFetched, logoUrl, vendorWebsite]);

  return {
    logoUrl: useLogo(),
    isLoading: useLogoLoading(),
    error: useLogoError(),
    upload: useLogoStore(state => state.upload),
    remove: useLogoStore(state => state.remove),
  };
};
