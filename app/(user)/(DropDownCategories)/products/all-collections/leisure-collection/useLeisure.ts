import { useState, useEffect } from "react";
import { fetchLeisure, ProductWithFeaturedImage } from "./actions";

const useLeisure = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeisure = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchLeisure();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching leisure collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLeisure();
  }, []);

  return { products, loading, error };
};

export default useLeisure;
