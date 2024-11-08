// userStatsStore.ts
import { create } from "zustand";
import { fetchUserStatistics } from "./actions";

interface UserStats {
  totalCustomers: number;
  pendingRegistrations: number;
  activeUserSessions: number;
  newlyUpgradedCustomers: number;
}

interface UserStatsState {
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
  isInitialized: boolean;
  initializeStats: () => Promise<void>;
  fetchStats: () => Promise<void>;
  clearError: () => void;
}

// Track initialization status outside of store
let isInitializing = false;
let refreshInterval: NodeJS.Timeout | null = null;

export const useUserStatsStore = create<UserStatsState>((set, get) => ({
  stats: null,
  isLoading: false,
  error: null,
  lastFetched: null,
  isInitialized: false,

  initializeStats: async () => {
    // Prevent multiple initialization attempts
    if (get().isInitialized || isInitializing) return;

    isInitializing = true;

    try {
      await get().fetchStats();

      // Set up refresh interval only once
      if (!refreshInterval) {
        refreshInterval = setInterval(
          () => {
            get().fetchStats();
          },
          5 * 60 * 1000
        ); // 5 minutes
      }

      set({ isInitialized: true });
    } finally {
      isInitializing = false;
    }
  },

  fetchStats: async () => {
    const lastFetched = get().lastFetched;
    const now = new Date();

    // Prevent fetching if done recently (within last 10 seconds)
    if (lastFetched && now.getTime() - lastFetched.getTime() < 10000) {
      return;
    }

    if (get().isLoading) return;

    set({ isLoading: true });

    try {
      const result = await fetchUserStatistics();

      if (result.success) {
        set({
          stats: result.data,
          error: null,
          lastFetched: new Date(),
        });
      } else {
        set({ error: result.error });
      }
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      });
    } finally {
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));

// Cleanup function for the interval
export const cleanupUserStatsStore = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// Optional: Create selector hooks for specific pieces of state
export const useUserStats = () => useUserStatsStore(state => state.stats);
export const useUserStatsLoading = () =>
  useUserStatsStore(state => state.isLoading);
export const useUserStatsError = () => useUserStatsStore(state => state.error);
