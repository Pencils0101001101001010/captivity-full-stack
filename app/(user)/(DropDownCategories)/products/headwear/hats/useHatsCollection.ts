import { useState, useEffect } from "react";
import { fetchHatsCollection, ProductWithFeaturedImage } from "./actions";

const useHatsCollection = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHatsCollection = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchHatsCollection();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching hats collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHatsCollection();
  }, []);

  return { products, loading, error };
};

export default useHatsCollection;
