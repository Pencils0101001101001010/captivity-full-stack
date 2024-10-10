import { useState, useCallback, useEffect, useMemo } from "react";
import { Product } from "@prisma/client";
import { fetchWinterCollections } from "./actions";
import { categorizeWinterProducts, WinterProductCategories} from "./utils";

export const useWinterProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchWinterCollections();

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

  const categorizedWinterProducts = useMemo<WinterProductCategories>(
    () => categorizeWinterProducts(products),
    [products]
  );

  return { categorizedWinterProducts, isLoading, error };
};
