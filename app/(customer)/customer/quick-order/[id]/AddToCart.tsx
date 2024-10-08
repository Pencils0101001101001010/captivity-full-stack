import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/app/CartContext";
import toast from "react-hot-toast";

interface AddToCartProps {
  productId: number;
  quantity: number;
}

const AddToCart: React.FC<AddToCartProps> = ({ productId, quantity }) => {
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
      toast.error("An error occurred. Please try again later.", {
        duration: 3000,
        position: "bottom-right",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleAddToCart} disabled={isLoading}>
        {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
};

export default AddToCart;
