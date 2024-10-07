import React from "react";

interface AddToCartProps {
  selectedSize: string;
  selectedColor: string;
  selectedQuantity: number; // Added selectedQuantity prop
}

const AddToCart: React.FC<AddToCartProps> = ({
  selectedSize,
  selectedColor,
  selectedQuantity, // Destructure selectedQuantity
}) => {
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor || selectedQuantity <= 0) {
      alert("Please select size, color, and quantity.");
      return;
    }

    // Logic for adding product with selectedSize, selectedColor, and selectedQuantity to the cart
    console.log(
      `Adding to cart: Size - ${selectedSize}, Color - ${selectedColor}, Quantity - ${selectedQuantity}`
    );
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      Add to Cart
    </button>
  );
};

export default AddToCart;
