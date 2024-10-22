"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import {
  useSummerProducts,
  useSummerLoading,
  useSummerError,
  useSummerActions,
} from "../../_store/useSummerStore";
import SummerCarousel from "./SummerCarousel";
import type {
  Category,
  ProductWithRelations,
} from "../../_store/useSummerStore";

const SummerCollectionPage: React.FC = () => {
  // Use individual selectors instead of the whole store
  const summerProducts = useSummerProducts();
  const loading = useSummerLoading();
  const error = useSummerError();
  const { fetchSummerCollection } = useSummerActions();

  // Memoize the check for empty products
  const isProductsEmpty = useMemo(
    () => Object.values(summerProducts).every(arr => arr.length === 0),
    [summerProducts]
  );

  // Memoize non-empty categories
  const nonEmptyCategories = useMemo(
    () =>
      Object.entries(summerProducts).filter(
        ([_, products]) => products.length > 0
      ) as [Category, ProductWithRelations[]][],
    [summerProducts]
  );

  const fetchData = useCallback(async () => {
    if (isProductsEmpty && !loading && !error) {
      await fetchSummerCollection();
    }
  }, [isProductsEmpty, loading, error, fetchSummerCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading summer collection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4">
      {nonEmptyCategories.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">
            No products available in the summer collection.
          </h2>
        </div>
      ) : (
        nonEmptyCategories.map(([category, products]) => (
          <SummerCarousel
            key={category}
            category={category}
            products={products}
          />
        ))
      )}
    </div>
  );
};

// Memoize the entire component
export default React.memo(SummerCollectionPage);
