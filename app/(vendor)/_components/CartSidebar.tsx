// components/CartSidebar.tsx
"use client";
import { ShoppingBag, X } from "lucide-react";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar = ({ isOpen, onClose }: CartSidebarProps) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-50 
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-[450px] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart content */}
        <div className="flex flex-col h-[calc(100%-180px)] overflow-y-auto">
          {/* Empty state */}
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <ShoppingBag className="w-16 h-16 mb-4" />
            <p className="text-lg">Your cart is empty</p>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 border-t bg-white p-4 space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>$0.00</span>
          </div>
          <button
            className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
            onClick={() => {
              /* Handle checkout */
            }}
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
