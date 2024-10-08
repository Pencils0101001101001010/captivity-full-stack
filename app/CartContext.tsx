"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getCartItemCount,
  fetchCartItems,
  addToCart as addToCartAction,
} from "./(customer)/customer/quick-order/[id]/actions";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  attributes: string;
}

interface CartContextType {
  cartItemCount: number;
  cartItems: CartItem[];
  cartTotal: number;
  updateCartItemCount: () => Promise<void>;
  addItemToCart: (productId: number, quantity: number) => Promise<void>;
  fetchCartData: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const updateCartItemCount = async () => {
    try {
      const count = await getCartItemCount();
      setCartItemCount(count);
    } catch (error) {
      console.error("Failed to update cart count:", error);
    }
  };

  const addItemToCart = async (productId: number, quantity: number) => {
    setIsLoading(true);
    try {
      const result = await addToCartAction(productId, quantity);
      if (result.success) {
        await fetchCartData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error in addItemToCart:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCartData = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await fetchCartItems();
      setCartItems(items);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartItemCount(itemCount);
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      setCartTotal(total);
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCartData();

    // Set up an interval to fetch cart data every 5 minutes
    const intervalId = setInterval(() => {
      fetchCartData();
    }, 300000);

    // Clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [fetchCartData]);

  return (
    <CartContext.Provider
      value={{
        cartItemCount,
        cartItems,
        cartTotal,
        updateCartItemCount,
        addItemToCart,
        fetchCartData,
        isLoading,
      }}
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
