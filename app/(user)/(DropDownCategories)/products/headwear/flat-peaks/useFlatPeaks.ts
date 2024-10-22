import { useState, useEffect } from "react";
import { fetchFlatPeaks, ProductWithFeaturedImage } from "./actions";

const useFlatPeaks = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewHeadwear = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchFlatPeaks();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching flat peaks products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNewHeadwear();
  }, []);

  return { products, loading, error };
};

export default useFlatPeaks;
