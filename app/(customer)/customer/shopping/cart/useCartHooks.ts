import { useState, useEffect, useCallback } from "react";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
  clearCart,
} from "./actions";

export type CartItem = {
  productId: number;
  variationId: number;
  quantity: number;
};

export type CartData = {
  id: number;
  items: CartItem[];
};

type CartActionResult<T = void> =
  | { success: true; message: string; data?: T }
  | { success: false; error: string };

export function useCart() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCart();
      if (result.success && result.data) {
        setCart(result.data);
      } else if (!result.success) {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (productId: number, variationId: number, quantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await addToCart(productId, variationId, quantity);
        if (result.success && result.data) {
          setCart(result.data);
        } else if (!result.success) {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to add item to cart");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const removeItem = useCallback(
    async (productId: number, variationId: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await removeFromCart(productId, variationId);
        if (result.success && result.data) {
          setCart(result.data);
        } else if (!result.success) {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to remove item from cart");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateItemQuantity = useCallback(
    async (productId: number, variationId: number, newQuantity: number) => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateCartItemQuantity(
          productId,
          variationId,
          newQuantity
        );
        if (result.success && result.data) {
          setCart(result.data);
        } else if (!result.success) {
          setError(result.error);
        }
      } catch (err) {
        setError("Failed to update item quantity");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearAllItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await clearCart();
      if (result.success) {
        setCart({ id: 0, items: [] });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    cart,
    loading,
    error,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAllItems,
    refreshCart: fetchCart,
  };
}
