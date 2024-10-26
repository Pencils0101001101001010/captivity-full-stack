import { useState, useEffect } from "react";
import { fetchJackets, ProductWithFeaturedImage } from "./actions";

const useJackets = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJackets = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchJackets();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching Jackets products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadJackets();
  }, []);

  return { products, loading, error };
};

export default useJackets;
