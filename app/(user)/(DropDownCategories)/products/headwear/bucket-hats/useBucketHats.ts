import { useState, useEffect } from "react";
import { fetchBucketHats, ProductWithFeaturedImage } from "./actions";

const useBucketHats = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBucketHats = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchBucketHats();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching bucket-hats."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBucketHats();
  }, []);

  return { products, loading, error };
};

export default useBucketHats;
