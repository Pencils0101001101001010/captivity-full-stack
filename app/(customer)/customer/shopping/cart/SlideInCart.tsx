"use client";

import React, { useEffect, useState, useCallback, useTransition } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import {
  fetchCart,
  CartItem,
  deleteCartItem,
  updateCartItemQuantity,
} from "./actions";

import toast from "react-hot-toast";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const [cartData, setCartData] = useState<{
    cartItems: CartItem[];
    totalCost: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const loadCartData = useCallback(() => {
    startTransition(async () => {
      const result = await fetchCart();
      if (result.success) {
        setCartData(result.data);
      } else {
        toast.error(result.error);
      }
    });
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadCartData();
    }
  }, [isOpen, loadCartData]);

  const handleDeleteItem = async (cartItemId: number) => {
    // Optimistic update
    if (cartData) {
      const updatedItems = cartData.cartItems.filter(
        item => item.id !== cartItemId
      );
      const updatedTotalCost = updatedItems.reduce(
        (sum, item) =>
          sum + item.variation.product.sellingPrice * item.quantity,
        0
      );
      setCartData({ cartItems: updatedItems, totalCost: updatedTotalCost });
    }

    startTransition(async () => {
      const result = await deleteCartItem(cartItemId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.error);
        // Revert the optimistic update if the delete operation failed
        loadCartData();
      }
    });
  };

  const handleQuantityChange = async (
    cartItemId: number,
    newQuantity: number
  ) => {
    setUpdatingItemId(cartItemId);
    // Optimistic update
    if (cartData) {
      const updatedItems = cartData.cartItems.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
      const updatedTotalCost = updatedItems.reduce(
        (sum, item) =>
          sum + item.variation.product.sellingPrice * item.quantity,
        0
      );
      setCartData({ cartItems: updatedItems, totalCost: updatedTotalCost });
    }

    startTransition(async () => {
      const result = await updateCartItemQuantity(cartItemId, newQuantity);
      if (result.success) {
        toast.success(result.message);
        // Update the cart data with the new quantity and total cost from the server
        if (cartData) {
          const updatedItems = cartData.cartItems.map(item =>
            item.id === cartItemId
              ? { ...item, quantity: result.newQuantity }
              : item
          );
          setCartData({
            cartItems: updatedItems,
            totalCost: result.newTotalCost,
          });
        }
      } else {
        toast.error(result.error);
        // Revert the optimistic update if the operation failed
        loadCartData();
      }
      setUpdatingItemId(null);
    });
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
        {isPending && !cartData ? (
          <p className="text-gray-500">Loading your cart...</p>
        ) : cartData && cartData.cartItems.length > 0 ? (
          <div className="space-y-4">
            {cartData.cartItems.map(item => (
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
                      disabled={updatingItemId === item.id}
                    >
                      {renderQuantityOptions(item.variation.quantity)}
                    </select>
                    {updatingItemId === item.id && (
                      <span className="ml-2 text-sm text-gray-500">
                        Updating...
                      </span>
                    )}
                  </div>
                </div>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteItem(item.id)}
                  disabled={isPending}
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
      {cartData && cartData.cartItems.length > 0 && (
        <div className="p-4 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-xl font-bold">
              ${cartData.totalCost.toFixed(2)}
            </span>
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
