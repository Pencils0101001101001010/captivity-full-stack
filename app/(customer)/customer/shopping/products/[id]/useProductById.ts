import { useState, useEffect } from "react";
import {
  Product,
  Variation,
  DynamicPricing,
  FeaturedImage,
} from "@prisma/client";
import { getProductById } from "./actions";

export type ProductWithRelations = Product & {
  variations: Variation[];
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
};

export type UseProductByIdResult = {
  product: ProductWithRelations | null;
  isLoading: boolean;
  error: string | null;
};

export function useProductById(productId: number): UseProductByIdResult {
  const [product, setProduct] = useState<ProductWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getProductById(productId);

        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProduct();
  }, [productId]);

  return { product, isLoading, error };
}
