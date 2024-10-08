import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";

interface AddToCartProps {
  productId: number;
  quantity: number;
  className: string;
}

const AddToCart: React.FC<AddToCartProps> = ({
  productId,
  quantity,
  className,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItemToCart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await addItemToCart(productId, quantity);
      toast.success("Added to cart successfully!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart. Please try again.", {
        duration: 3000,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? "Adding..." : "Add to Cart"}
    </Button>
  );
};

export default AddToCart;
