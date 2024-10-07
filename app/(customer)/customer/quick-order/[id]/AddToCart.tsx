import React from "react";

interface AddToCartProps {
  selectedSize: string;
  selectedColor: string;
}

const AddToCart: React.FC<AddToCartProps> = ({
  selectedSize,
  selectedColor,
}) => {
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Please select both size and color.");
      return;
    }

    // Logic for adding product with selectedSize and selectedColor to the cart
    console.log(
      `Adding to cart: Size - ${selectedSize}, Color - ${selectedColor}`
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
