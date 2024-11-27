import { useCallback, useEffect } from "react";
import { Review } from "../../types";
import { useReviewStore } from "../useReviewStore";

interface UseProductReviews {
  reviews: Review[];
  isLoading: boolean;
  fetchReviews: () => Promise<void>;
  addReview: (review: Review) => void;
  updateReviewHelpful: (reviewId: string, data: Partial<Review>) => void;
}

export const useProductReviews = (productId: string): UseProductReviews => {
  const {
    reviews: allReviews,
    isLoading: allLoadingStates,
    actions,
  } = useReviewStore();

  const fetchReviews = useCallback(
    () => actions.fetchReviews(productId),
    [actions, productId]
  );

  const addReview = useCallback(
    (review: Review) => actions.addReview(productId, review),
    [actions, productId]
  );

  const updateReviewHelpful = useCallback(
    (reviewId: string, data: Partial<Review>) =>
      actions.updateReviewHelpful(productId, reviewId, data),
    [actions, productId]
  );

  // Auto-fetch reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return {
    reviews: allReviews[productId] || [],
    isLoading: allLoadingStates[productId] || false,
    fetchReviews,
    addReview,
    updateReviewHelpful,
  };
};
