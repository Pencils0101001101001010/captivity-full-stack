import { Button } from "@/components/ui/button";
import React from "react";

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
  const handleAddToCart = () => {
    // Log the product details to the console
    console.log("Adding product to cart:", {
      id: productId,
      name: productName,
      color: selectedColor,
      size: selectedSize,
      quantity: quantity,
      price: price,
    });
  };

  return (
    <Button
      variant="default"
      className="w-full text-white py-2 px-4 rounded hover:bg-blue-700"
      onClick={handleAddToCart}
    >
      Add to Cart
    </Button>
  );
};

export default AddToCartButton;
