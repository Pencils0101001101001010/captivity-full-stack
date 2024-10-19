import { useState, useEffect } from "react";
import { fetchSummerCollection } from "./actions";

type Product = {
  id: number;
  productName: string;
  sellingPrice: number;
  featuredImage: {
    medium: string;
  } | null;
};

type SummerCollectionHookResult = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

export function useSummerCollection(): SummerCollectionHookResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const result = await fetchSummerCollection();
        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  return { products, isLoading, error };
}
