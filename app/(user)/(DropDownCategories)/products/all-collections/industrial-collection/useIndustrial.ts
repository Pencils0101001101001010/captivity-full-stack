import { useState, useEffect } from "react";
import { fetchIndustrial, ProductWithFeaturedImage } from "./actions";

const useIndustrial = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadIndustrial = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchIndustrial();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching industrial collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadIndustrial();
  }, []);

  return { products, loading, error };
};

export default useIndustrial;
