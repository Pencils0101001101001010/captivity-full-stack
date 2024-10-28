import { useState, useEffect } from "react";
import { fetchSignature, ProductWithFeaturedImage } from "./actions";

const useSignature = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSignature = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchSignature();

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching signature collection."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSignature();
  }, []);

  return { products, loading, error };
};

export default useSignature;
