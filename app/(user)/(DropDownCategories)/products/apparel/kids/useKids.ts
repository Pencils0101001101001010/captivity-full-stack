import { useState, useEffect } from "react";
import { fetchKids, ProductWithFeaturedImage } from "./actions";

const useKids = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKids = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchKids();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching Kids products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadKids();
  }, []);

  return { products, loading, error };
};

export default useKids;
