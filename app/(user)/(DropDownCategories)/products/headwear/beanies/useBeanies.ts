import { useState, useEffect } from "react";
import { fetchBeanies, ProductWithFeaturedImage } from "./actions";

const useBeanies = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBeanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchBeanies();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching beanies."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBeanies();
  }, []);

  return { products, loading, error };
};

export default useBeanies;
