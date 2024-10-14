// useSummerProducts.ts
import { useState, useEffect } from "react";
import { fetchWinterCollections } from "./actions";
import { ProductWithFeaturedImage } from "../productTypes";

const useWinterProducts = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchWinterCollections();
        if (result.success) {
          setProducts(result.data as ProductWithFeaturedImage[]);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching the winter products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLatestProducts();
  }, []);

  return { products, loading, error };
};

export default useWinterProducts;
