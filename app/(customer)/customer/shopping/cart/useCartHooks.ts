import { useState, useEffect, useCallback, useRef } from "react";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getCart,
  clearCart,
  CartItem,
  ExtendedCartItem,
  CartData,
  CartActionResult,
} from "./actions";

export function useCart() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pendingRequest = useRef<Promise<CartActionResult<CartData>> | null>(
    null
  );

  const updateCartIfChanged = useCallback((newCart: CartData) => {
    setCart(prevCart => {
      if (
        !prevCart ||
        prevCart.id !== newCart.id ||
        JSON.stringify(prevCart.items) !== JSON.stringify(newCart.items)
      ) {
        return newCart;
      }
      return prevCart;
    });
  }, []);

  const fetchCart = useCallback(async (): Promise<
    CartActionResult<CartData>
  > => {
    if (pendingRequest.current) {
      return pendingRequest.current;
    }

    setLoading(true);
    setError(null);

    const request = getCart()
      .then(result => {
        if (result.success && result.data) {
          updateCartIfChanged(result.data);
        } else if (!result.success) {
          setError(result.error);
        }
        return result;
      })
      .catch(err => {
        setError("Failed to fetch cart");
        return {
          success: false,
          error: "Failed to fetch cart",
        } as CartActionResult<CartData>;
      })
      .finally(() => {
        setLoading(false);
        pendingRequest.current = null;
      });

    pendingRequest.current = request;
    return request;
  }, [updateCartIfChanged]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(
    async (
      productId: number,
      variationId: number,
      quantity: number
    ): Promise<CartActionResult<CartData>> => {
      setLoading(true);
      setError(null);

      try {
        const result = await addToCart(productId, variationId, quantity);
        if (result.success && result.data) {
          updateCartIfChanged(result.data);
        } else if (!result.success) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        setError("Failed to add item to cart");
        return {
          success: false,
          error: "Failed to add item to cart",
        };
      } finally {
        setLoading(false);
      }
    },
    [updateCartIfChanged]
  );

  const removeItem = useCallback(
    async (
      productId: number,
      variationId: number
    ): Promise<CartActionResult<CartData>> => {
      setLoading(true);
      setError(null);
      try {
        const result = await removeFromCart(productId, variationId);
        if (result.success && result.data) {
          updateCartIfChanged(result.data);
        } else if (!result.success) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        setError("Failed to remove item from cart");
        return {
          success: false,
          error: "Failed to remove item from cart",
        };
      } finally {
        setLoading(false);
      }
    },
    [updateCartIfChanged]
  );

  const updateItemQuantity = useCallback(
    async (
      productId: number,
      variationId: number,
      newQuantity: number
    ): Promise<CartActionResult<CartData>> => {
      setLoading(true);
      setError(null);
      try {
        const result = await updateCartItemQuantity(
          productId,
          variationId,
          newQuantity
        );
        if (result.success && result.data) {
          updateCartIfChanged(result.data);
        } else if (!result.success) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        setError("Failed to update item quantity");
        return {
          success: false,
          error: "Failed to update item quantity",
        };
      } finally {
        setLoading(false);
      }
    },
    [updateCartIfChanged]
  );

  const clearAllItems = useCallback(async (): Promise<
    CartActionResult<CartData>
  > => {
    setLoading(true);
    setError(null);
    try {
      const result = await clearCart();
      if (result.success && result.data) {
        updateCartIfChanged(result.data);
      } else if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      setError("Failed to clear cart");
      return {
        success: false,
        error: "Failed to clear cart",
      };
    } finally {
      setLoading(false);
    }
  }, [updateCartIfChanged]);

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

export type { CartItem, CartData, ExtendedCartItem, CartActionResult };
