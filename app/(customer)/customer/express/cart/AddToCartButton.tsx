"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React from "react";
import { addToCart } from "./actions";

interface AddToCartButtonProps {
  productId: number;
  productName: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  price: number;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  selectedColor,
  selectedSize,
  quantity,
  price,
}) => {
  const { toast } = useToast();
  const [isPending, setIsPending] = React.useState(false);

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      toast({
        title: "Please select options",
        description: "Please select both color and size before adding to cart",
        variant: "destructive",
      });
      return;
    }

    // Log the data being sent to the database
    console.log("Sending to database:", {
      productId,
      productName,
      color: selectedColor,
      size: selectedSize,
      quantity,
      price,
    });

    try {
      setIsPending(true);

      const result = await addToCart({
        productId,
        quantity,
        color: selectedColor,
        size: selectedSize,
      });

      // Log the response from the server
      console.log("Server response:", result);

      toast({
        variant: "default",
        title: "Success!",
        description: `Added ${quantity}x ${productName} (${selectedColor}, ${selectedSize}) to your cart`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to add item to cart";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button
      variant="default"
      className="w-full text-white py-2 px-4 rounded hover:bg-blue-700"
      onClick={handleAddToCart}
      disabled={isPending || !selectedColor || !selectedSize}
    >
      {isPending ? "Adding..." : "Add to Cart"}
    </Button>
  );
};

export default AddToCartButton;