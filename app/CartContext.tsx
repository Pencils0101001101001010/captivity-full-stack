"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  addToCart,
  getCartItemCount,
} from "./(customer)/customer/quick-order/[id]/actions";
// Adjust the import path as necessary

interface CartContextType {
  cartItemCount: number;
  updateCartItemCount: () => Promise<void>;
  addItemToCart: (productId: number, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const updateCartItemCount = async () => {
    try {
      // This function should be implemented in your actions file
      const count = await getCartItemCount();
      setCartItemCount(count);
    } catch (error) {
      console.error("Failed to update cart count:", error);
    }
  };

  const addItemToCart = async (productId: number, quantity: number) => {
    const result = await addToCart(productId, quantity);
    if (result.success) {
      await updateCartItemCount();
    } else {
      console.error("Failed to add item to cart:", result.error);
    }
  };

  useEffect(() => {
    updateCartItemCount();
  }, []);

  return (
    <CartContext.Provider
      value={{ cartItemCount, updateCartItemCount, addItemToCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
