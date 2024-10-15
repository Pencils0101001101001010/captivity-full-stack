import React, { useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Variation } from "@prisma/client";
import { useCart } from "./useCartHooks";

interface AddToCartButtonProps {
  productId: number;
  selectedVariation: Variation | null;
  quantity: number;
  maxQuantity: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  selectedVariation,
  quantity,
  maxQuantity,
}) => {
  const { addItem, loading, error: hookError } = useCart();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = useCallback(async () => {
    if (loading) return;

    if (!selectedVariation) {
      setError("Please select a color and size");
      return;
    }
    if (quantity === 0 || maxQuantity === 0) {
      setError("This item is out of stock");
      return;
    }
    try {
      const result = await addItem(productId, selectedVariation.id, quantity);
      if (result.success) {
        setSuccess(true);
        setError(null);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to add item to cart. Please try again.");
    }
  }, [addItem, productId, selectedVariation, quantity, maxQuantity, loading]);

  const buttonText = useMemo(() => {
    if (maxQuantity === 0) return "Out of Stock";
    if (loading) return "Adding...";
    return "Add to Cart";
  }, [maxQuantity, loading]);

  const isDisabled = useMemo(() => {
    return !selectedVariation || maxQuantity === 0 || loading;
  }, [selectedVariation, maxQuantity, loading]);

  return (
    <div>
      <Button
        onClick={handleAddToCart}
        className="w-full"
        disabled={isDisabled}
      >
        {buttonText}
      </Button>
      {success && (
        <p className="text-green-500 mt-2">Item added to cart successfully!</p>
      )}
      {(error || hookError) && (
        <p className="text-red-500 mt-2">{error || hookError}</p>
      )}
    </div>
  );
};

export default React.memo(AddToCartButton, (prevProps, nextProps) => {
  return (
    prevProps.productId === nextProps.productId &&
    prevProps.selectedVariation?.id === nextProps.selectedVariation?.id &&
    prevProps.quantity === nextProps.quantity &&
    prevProps.maxQuantity === nextProps.maxQuantity
  );
});
