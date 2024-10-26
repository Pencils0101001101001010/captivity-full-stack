import { useState, useEffect } from "react";
import { fetchMen, ProductWithFeaturedImage } from "./actions";

const useMen = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMen = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchMen();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching Men products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMen();
  }, []);

  return { products, loading, error };
};

export default useMen;
