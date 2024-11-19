"use client";

import React, { useState } from "react";
import { VendorVariation } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/app/(vendor)/SessionProvider";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import useVendorCartStore from "./useCartStore";

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
  const addToCart = useVendorCartStore(state => state.addToCart);
  const error = useVendorCartStore(state => state.error);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user } = useSession() as SessionData;

  const handleAddToCart = async () => {
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

    if (selectedVariation) {
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
    }
  };

  // Only use local loading state, not the global one
  const isButtonDisabled =
    disabled ||
    isAddingToCart ||
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
      {isAddingToCart ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding to Cart...
        </span>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
};

export default VendorAddToCartButton;
