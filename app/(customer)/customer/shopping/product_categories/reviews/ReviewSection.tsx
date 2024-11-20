// DetailedReviewCard.tsx
"use client";
import { useEffect } from "react";
import { ProductWithRelations } from "../types";
import ReviewSection from "./ReviewsComponent";
import { Card } from "@/components/ui/card";
import { useReviewStore } from "./useReviewStore";

interface DetailedReviewCardProps {
  product: ProductWithRelations;
}

const DetailedReviewCard: React.FC<DetailedReviewCardProps> = ({ product }) => {
  const { reviews, isLoading, fetchReviews, addReview } = useReviewStore();

  useEffect(() => {
    fetchReviews(product.id);
  }, [product.id, fetchReviews]);

  const productReviews = reviews[product.id] || [];
  const isLoadingReviews = isLoading[product.id] || false;

  if (!product?.id) {
    return null;
  }

  return (
    <div>
      <Card className="mb-5">
        <ReviewSection
          productId={product.id}
          initialReviews={productReviews}
          onReviewAdded={review => addReview(product.id, review)}
          isLoading={isLoadingReviews}
        />
      </Card>
    </div>
  );
};

export default DetailedReviewCard;
