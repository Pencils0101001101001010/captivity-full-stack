import { create } from "zustand";
import { Review } from "../types";
import { getProductReviews } from "./actions";

interface ReviewState {
  reviews: { [productId: string]: Review[] };
  isLoading: { [productId: string]: boolean };
  fetchReviews: (productId: string) => Promise<void>;
  addReview: (productId: string, review: Review) => void;
  updateReviewHelpful: (
    productId: string,
    reviewId: string,
    data: Partial<Review>
  ) => void;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: {},
  isLoading: {},

  fetchReviews: async (productId: string) => {
    // Check if we already have reviews for this product
    if (get().reviews[productId]) return;

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
}));
