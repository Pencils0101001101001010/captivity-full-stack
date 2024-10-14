import { useState, useCallback, useEffect, useMemo } from "react";
import { Product } from "@prisma/client";
import { fetchSportCollections } from "./actions";
import { categorizeSportProducts, SportProductCategories } from "./utils";

export const useSportProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchSportCollections();

      if (result.success) {
        setProducts(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      setError("Failed to load sport products. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const categorizedSportProducts = useMemo<SportProductCategories>(
    () => categorizeSportProducts(products),
    [products]
  );

  return { categorizedSportProducts, isLoading, error };
};
