import { useState, useEffect } from "react";
import { fetchHoodies, ProductWithFeaturedImage } from "./actions";

const useHoodies = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHoodies = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchHoodies();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching Hoodies products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHoodies();
  }, []);

  return { products, loading, error };
};

export default useHoodies;
