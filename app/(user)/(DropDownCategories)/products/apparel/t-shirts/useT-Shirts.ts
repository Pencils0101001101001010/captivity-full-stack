import { useState, useEffect } from "react";
import { fetchTshirts, ProductWithFeaturedImage } from "./actions";

const useTshirts = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTshirts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchTshirts();

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

    loadTshirts();
  }, []);

  return { products, loading, error };
};

export default useTshirts;
