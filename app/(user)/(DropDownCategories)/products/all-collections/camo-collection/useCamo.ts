import { useState, useEffect } from "react";
import { fetchCamo, ProductWithFeaturedImage } from "./actions";

const useCamo = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCamo = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchCamo();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching camo collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCamo();
  }, []);

  return { products, loading, error };
};

export default useCamo;
