import { useState, useEffect } from "react";
import { fetchFashion, ProductWithFeaturedImage } from "./actions";

const useFashion = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFashion = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFashion();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching fashion collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadFashion();
  }, []);

  return { products, loading, error };
};

export default useFashion;
