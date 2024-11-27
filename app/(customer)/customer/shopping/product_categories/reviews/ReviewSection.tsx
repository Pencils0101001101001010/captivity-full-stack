"use client";
import { memo } from "react";
import { ProductWithRelations } from "../types";
import ReviewSection from "./ReviewsComponent";
import { Card } from "@/components/ui/card";
import { useProductReviews } from "./hooks/useProductReviews";

interface DetailedReviewCardProps {
  product: ProductWithRelations;
}

const DetailedReviewCard: React.FC<DetailedReviewCardProps> = memo(
  ({ product }) => {
    // Use the custom hook instead of direct store access
    const { reviews, isLoading, addReview } = useProductReviews(product.id);

    if (!product?.id) {
      return null;
    }

    return (
      <div>
        <Card className="mb-5">
          <ReviewSection
            productId={product.id}
            initialReviews={reviews}
            onReviewAdded={addReview}
            isLoading={isLoading}
          />
        </Card>
      </div>
    );
  }
);

DetailedReviewCard.displayName = "DetailedReviewCard";
export default DetailedReviewCard;
