import { useState, useEffect } from "react";
import { fetchSummerCollection } from "./actions";

export function useSummerCollection(): SummerCollectionHookResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
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
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return { products, isLoading, error, refetch };
}
