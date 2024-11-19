"use client";

import React, { useState, useCallback } from "react";
import { VendorVariation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/(vendor)/SessionProvider";
import useVendorCartStore from "./useCartStore";
import { toast } from "@/hooks/use-toast";

interface VendorAddToCartButtonProps {
  selectedVariation: VendorVariation | null;
  quantity: number;
  disabled?: boolean;
  className?: string;
}

interface User {
  id: string;
  role: string;
}

interface SessionData {
  user: User | null;
}

const VendorAddToCartButton: React.FC<VendorAddToCartButtonProps> = ({
  selectedVariation,
  quantity,
  disabled,
  className = "",
}) => {
  // Get store values without subscribing to all changes
  const addToCart = useVendorCartStore(state => state.addToCart);
  const isLoading = useVendorCartStore(state => state.isLoading);
  const error = useVendorCartStore(state => state.error);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user } = useSession() as SessionData;

  const handleAddToCart = useCallback(async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login as a vendor customer to add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (
      !["VENDOR", "VENDORCUSTOMER", "APPROVEDVENDORCUSTOMER"].includes(
        user.role
      )
    ) {
      toast({
        title: "Access Denied",
        description: "Only vendor customers can add items to cart",
        variant: "destructive",
      });
      return;
    }

    if (!selectedVariation) return;

    try {
      setIsAddingToCart(true);
      await addToCart(selectedVariation.id, quantity);

      if (error) {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Item added to cart successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  }, [user, selectedVariation, quantity, addToCart, error]);

  // Memoize the button disabled state
  const isButtonDisabled =
    disabled ||
    isAddingToCart ||
    isLoading ||
    !selectedVariation ||
    quantity < 1 ||
    (selectedVariation && quantity > selectedVariation.quantity);

  return (
    <Button
      className={`w-full ${className}`}
      disabled={isButtonDisabled}
      onClick={handleAddToCart}
      variant="default"
    >
      {isAddingToCart || isLoading ? (
        <span className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Adding to Cart...
        </span>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
};

export default VendorAddToCartButton;
