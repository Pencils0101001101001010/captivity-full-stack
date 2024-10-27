import { useState, useEffect } from "react";
import { fetchBaseball, ProductWithFeaturedImage } from "./actions";

const useBaseball = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBaseball = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchBaseball();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching baseball collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBaseball();
  }, []);

  return { products, loading, error };
};

export default useBaseball;
