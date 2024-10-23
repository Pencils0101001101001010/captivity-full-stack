import { useState, useEffect } from "react";
import { fetchMultifunctionalHeadwear, ProductWithFeaturedImage } from "./actions";

const useMultifunctionalHeadwear = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMultifunctionalHeadwear = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchMultifunctionalHeadwear();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching multifunctional-headwear."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMultifunctionalHeadwear();
  }, []);

  return { products, loading, error };
};

export default useMultifunctionalHeadwear;
