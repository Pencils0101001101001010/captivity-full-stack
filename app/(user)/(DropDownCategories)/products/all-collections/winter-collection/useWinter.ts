import { useState, useEffect } from "react";
import { fetchWinter, ProductWithFeaturedImage } from "./actions";

const useWinter = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWinter = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchWinter();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching winter collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWinter();
  }, []);

  return { products, loading, error };
};

export default useWinter;
