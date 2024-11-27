import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Review } from "../types";
import { getProductReviews } from "./actions";

interface ReviewState {
  reviews: { [productId: string]: Review[] };
  isLoading: { [productId: string]: boolean };
  lastFetched: { [productId: string]: number };
  actions: {
    fetchReviews: (productId: string) => Promise<void>;
    addReview: (productId: string, review: Review) => void;
    updateReviewHelpful: (
      productId: string,
      reviewId: string,
      data: Partial<Review>
    ) => void;
    clearReviews: (productId: string) => void;
  };
}

// Cache duration in milliseconds (e.g., 5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

export const useReviewStore = create<ReviewState>()(
  persist(
    (set, get) => ({
      reviews: {},
      isLoading: {},
      lastFetched: {},
      actions: {
        fetchReviews: async (productId: string) => {
          const state = get();
          const lastFetchTime = state.lastFetched[productId];
          const now = Date.now();

          // Return cached data if it's fresh enough
          if (
            state.reviews[productId] &&
            lastFetchTime &&
            now - lastFetchTime < CACHE_DURATION
          ) {
            return;
          }

          // Prevent multiple simultaneous fetches
          if (state.isLoading[productId]) {
            return;
          }

          set(state => ({
            isLoading: { ...state.isLoading, [productId]: true },
          }));

          try {
            const result = await getProductReviews(productId);
            if (result.success) {
              const reviewsWithDates = result.data.map(review => ({
                ...review,
                createdAt: new Date(review.createdAt),
                updatedAt: new Date(review.updatedAt),
              }));

              set(state => ({
                reviews: {
                  ...state.reviews,
                  [productId]: reviewsWithDates,
                },
                lastFetched: {
                  ...state.lastFetched,
                  [productId]: now,
                },
              }));
            }
          } finally {
            set(state => ({
              isLoading: { ...state.isLoading, [productId]: false },
            }));
          }
        },

        addReview: (productId: string, review: Review) => {
          set(state => ({
            reviews: {
              ...state.reviews,
              [productId]: [review, ...(state.reviews[productId] || [])],
            },
          }));
        },

        updateReviewHelpful: (
          productId: string,
          reviewId: string,
          data: Partial<Review>
        ) => {
          set(state => ({
            reviews: {
              ...state.reviews,
              [productId]:
                state.reviews[productId]?.map(review =>
                  review.id === reviewId ? { ...review, ...data } : review
                ) || [],
            },
          }));
        },

        clearReviews: (productId: string) => {
          set(state => {
            const { [productId]: _, ...remainingReviews } = state.reviews;
            const { [productId]: __, ...remainingLastFetched } =
              state.lastFetched;
            return {
              reviews: remainingReviews,
              lastFetched: remainingLastFetched,
            };
          });
        },
      },
    }),
    {
      name: "product-reviews-storage",
      storage: createJSONStorage(() => sessionStorage), // Using sessionStorage instead of localStorage
      partialize: state => ({
        reviews: state.reviews,
        lastFetched: state.lastFetched,
      }),
    }
  )
);
