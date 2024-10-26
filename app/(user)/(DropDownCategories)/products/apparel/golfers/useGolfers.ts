import { useState, useEffect } from "react";
import { fetchGolfers, ProductWithFeaturedImage } from "./actions";

const useGolfers = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGolfers = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchGolfers();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching Golfers products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadGolfers();
  }, []);

  return { products, loading, error };
};

export default useGolfers;
