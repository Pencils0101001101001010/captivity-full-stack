import { useState, useEffect } from "react";
import { fetchSport, ProductWithFeaturedImage } from "./actions";

const useSport = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSport = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchSport();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching sport collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSport();
  }, []);

  return { products, loading, error };
};

export default useSport;
