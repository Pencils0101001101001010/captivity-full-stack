import { useState, useEffect } from "react";
import { fetchNewApparel, ProductWithFeaturedImage } from "./actions";

const useNewApparel = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewApparel = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchNewApparel();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching New In Apparel products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNewApparel();
  }, []);

  return { products, loading, error };
};

export default useNewApparel;
