import { useState, useEffect } from "react";
import { fetchNewHeadwear, ProductWithFeaturedImage } from "./actions";

const useNewHeadwear = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNewHeadwear = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchNewHeadwear();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching new headwear products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadNewHeadwear();
  }, []);

  return { products, loading, error };
};

export default useNewHeadwear;
