import { useState, useEffect, useCallback, useRef } from "react";
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

export type CartActionResult<T = void> =
  | { success: true; message: string; data?: T }
  | { success: false; error: string };

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
      if (pendingRequest.current) {
        return pendingRequest.current;
      }

      setLoading(true);
      setError(null);

      const request = addToCart(productId, variationId, quantity)
        .then(result => {
          if (result.success && result.data) {
            updateCartIfChanged(result.data);
          } else if (!result.success) {
            setError(result.error);
          }
          return result;
        })
        .catch(err => {
          setError("Failed to add item to cart");
          return {
            success: false,
            error: "Failed to add item to cart",
          } as CartActionResult<CartData>;
        })
        .finally(() => {
          setLoading(false);
          pendingRequest.current = null;
        });

      pendingRequest.current = request;
      return request;
    },
    [updateCartIfChanged]
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
