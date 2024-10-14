// useSummerProducts.ts
import { useState, useEffect } from "react";
import { fetchSummerCollections } from "./actions";
import { ProductWithFeaturedImage } from "./types";

const useSummerProducts = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchSummerCollections();
        if (result.success) {
          setProducts(result.data as ProductWithFeaturedImage[]);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching the latest products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLatestProducts();
  }, []);

  return { products, loading, error };
};

export default useSummerProducts;
