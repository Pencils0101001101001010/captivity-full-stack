import { useState, useEffect } from "react";
import { fetchKidsColl, ProductWithFeaturedImage } from "./actions";

const useChildCollect = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadChildCollect = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchKidsColl();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching kid's collection."
        );
      } finally {
        setLoading(false);
      }
    };
    loadChildCollect();
  }, []);

  return { products, loading, error };
};

export default useChildCollect;
