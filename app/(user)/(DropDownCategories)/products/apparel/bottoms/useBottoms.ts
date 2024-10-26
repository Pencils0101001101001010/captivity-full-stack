import { useState, useEffect } from "react";
import { fetchBottoms, ProductWithFeaturedImage } from "./actions";

const useBottoms = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBottoms = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchBottoms();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching Bottoms products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBottoms();
  }, []);

  return { products, loading, error };
};

export default useBottoms;
