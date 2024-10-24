import { useState, useEffect } from "react";
import { fetchTruckerCaps, ProductWithFeaturedImage } from "./actions";

const useTruckerCaps = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTruckerCaps = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTruckerCaps();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching trucker-caps."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTruckerCaps();
  }, []);

  return { products, loading, error };
};

export default useTruckerCaps;
