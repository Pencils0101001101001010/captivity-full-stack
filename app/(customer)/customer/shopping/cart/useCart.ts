import { useEffect, useState } from "react";
import { fetchCart } from "./actions";

export function useCart() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCartData = async () => {
      setIsLoading(true);
      const result = await fetchCart();
      if (result.success) {
        setCartItemCount(result.data.cartItems.length);
      }
      setIsLoading(false);
    };

    getCartData();
  }, []);

  return { cartItemCount, isLoading };
}
