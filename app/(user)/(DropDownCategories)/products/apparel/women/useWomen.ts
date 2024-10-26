import { useState, useEffect } from "react";
import { fetchWomen, ProductWithFeaturedImage } from "./actions";

const useWomen = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWomen = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchWomen();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching Women products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadWomen();
  }, []);

  return { products, loading, error };
};

export default useWomen;
