"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useCartStore } from "../../_store/cartStore";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    totalCost,
    isLoading,
    error,
    fetchCart,
    updateCartItemQuantity,
    deleteCartItem,
    shouldFetchCart,
  } = useCartStore();

  useEffect(() => {
    if (isOpen && shouldFetchCart()) {
      fetchCart();
    }
  }, [isOpen, fetchCart, shouldFetchCart]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDeleteItem = async (cartItemId: number) => {
    await deleteCartItem(cartItemId);
  };

  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    await updateCartItemQuantity(cartItemId, newQuantity);
  };

  const renderQuantityOptions = (maxQuantity: number) => {
    const options = [];
    for (let i = 1; i <= maxQuantity; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-[450px] bg-white shadow-lg z-50 flex flex-col">
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {isLoading ? (
          <p className="text-gray-500">Loading your cart...</p>
        ) : cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartItems.map(item => (
              <div
                key={item.id}
                className="flex items-center space-x-4 pb-4 border-b border-gray-200"
              >
                <Image
                  src={item.variation.variationImageURL}
                  alt={item.variation.product.productName}
                  width={60}
                  height={60}
                  className="rounded-md object-cover"
                />
                <div className="flex-grow">
                  <p className="font-semibold">
                    {item.variation.product.productName}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.variation.color}, {item.variation.size}
                  </p>
                  <p className="text-gray-600">
                    ${item.variation.product.sellingPrice.toFixed(2)} x{" "}
                    {item.quantity}
                  </p>
                  <div className="flex items-center mt-2">
                    <select
                      value={item.quantity}
                      onChange={e =>
                        handleQuantityChange(item.id, parseInt(e.target.value))
                      }
                      className="border rounded px-2 py-1 text-sm"
                    >
                      {renderQuantityOptions(item.variation.quantity)}
                    </select>
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>
      {cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-xl font-bold">${totalCost.toFixed(2)}</span>
          </div>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
              Checkout
            </button>
            <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors">
              View Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
