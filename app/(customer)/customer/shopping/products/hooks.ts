import { useState, useCallback, useEffect, useMemo } from "react";
import { Product } from "@prisma/client";
import { fetchSummerCollections } from "./summer/actions";
import { categorizeProducts, ProductCategories } from "./utils";

export const useSummerProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSummerCollections();

      if (result.success) {
        setProducts(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError("Failed to load products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categorizedProducts = useMemo<ProductCategories>(
    () => categorizeProducts(products),
    [products]
  );

  return { categorizedProducts, isLoading, error };
};
