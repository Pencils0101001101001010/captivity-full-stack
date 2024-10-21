"use client";

import React, { useEffect, useCallback } from "react";
import useSummerStore from "../../_store/useSummerStore";
import SummerCarousel from "./SummerCarousel";

const SummerCollectionPage: React.FC = () => {
  const { summerProducts, loading, error, fetchSummerCollection } =
    useSummerStore();

  const fetchData = useCallback(async () => {
    if (
      Object.values(summerProducts).every(arr => arr.length === 0) &&
      !loading &&
      !error
    ) {
      await fetchSummerCollection();
    }
  }, [summerProducts, loading, error, fetchSummerCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading summer collection...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter out categories with no products
  const nonEmptyCategories = Object.entries(summerProducts).filter(
    ([_, products]) => products.length > 0
  );

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

export default SummerCollectionPage;
