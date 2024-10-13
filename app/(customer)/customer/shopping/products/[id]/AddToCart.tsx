"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { addToCart } from "./actions";

interface AddToCartButtonProps {
  productId: number;
  isDisabled: boolean;
  quantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  isDisabled,
  quantity,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleAddToCart = async () => {
    setIsLoading(true);
    setFeedback(null);

    try {
      const result = await addToCart(productId, quantity);
      if (result.success) {
        setFeedback("Added to cart successfully!");
      } else {
        setFeedback(result.error);
      }
    } catch (error) {
      setFeedback("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button
        onClick={handleAddToCart}
        disabled={isDisabled || isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out flex items-center justify-center"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-md" />
        ) : (
          <>
            <ShoppingCart className="mr-2 h-5 w-5" />
            Add to Cart
          </>
        )}
      </Button>
      {feedback && (
        <p
          className={`text-sm ${feedback.includes("error") ? "text-red-500" : "text-green-500"}`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
};

export default AddToCartButton;
