import { useState, useEffect } from "react";
import { fetchPreCurvedPeaks, ProductWithFeaturedImage } from "./actions";

const usePreCurvedPeaks = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPreCurvedPeaks = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchPreCurvedPeaks();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching pre-curved peaks."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPreCurvedPeaks();
  }, []);

  return { products, loading, error };
};

export default usePreCurvedPeaks;
