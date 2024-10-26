import { useState, useEffect } from "react";
import { fetchAfrican, ProductWithFeaturedImage } from "./actions";

const useAfrican = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadAfrican = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchAfrican();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching african collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAfrican();
  }, []);

  return { products, loading, error };
};

export default useAfrican;
