import { useState, useEffect } from "react";
import { fetchNewProducts } from "./actions";

type FeaturedImage = {
  id: number;
  thumbnail: string;
  medium: string;
  large: string;
  productId: number;
};

type ProductWithFeaturedImage = {
  id: number;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  featuredImage?: FeaturedImage | null;
};

const useLatestProducts = () => {
  const [products, setProducts] = useState<ProductWithFeaturedImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLatestProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await fetchNewProducts(); // Directly call the server action

        if (result.success) {
          setProducts(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(
          "An unexpected error occurred while fetching the latest products."
        );
      } finally {
        setLoading(false);
      }
    };

    loadLatestProducts();
  }, []);

  return { products, loading, error };
};

export default useLatestProducts;
