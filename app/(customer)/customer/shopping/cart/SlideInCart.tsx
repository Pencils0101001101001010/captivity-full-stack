// File: components/SlideInCart.tsx
import React from "react";
import { X } from "lucide-react";

interface SlideInCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlideInCart: React.FC<SlideInCartProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 flex flex-col`}
    >
      <div className="flex-grow overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Your Cart</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>
          {/* Add your cart items here */}
          <div className="mb-4">
            {/* Example cart items */}
            <div className="flex justify-between items-center mb-2">
              <span>Product 1</span>
              <span>R19.99</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Product 2</span>
              <span>R29.99</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span>Product 3</span>
              <span>R39.99</span>
            </div>
            {/* Add more items as needed */}
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="font-bold">Total:</span>
          <span className="font-bold">R89.97</span>
        </div>
        <button
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 transition duration-300"
          onClick={() => {
            // Add checkout logic here
            console.log("Proceeding to checkout");
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default SlideInCart;
