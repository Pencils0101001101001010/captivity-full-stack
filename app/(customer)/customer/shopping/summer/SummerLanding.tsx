"use client";

import React, { useEffect, useCallback, useMemo } from "react";
import {
  useSummerProducts,
  useSummerLoading,
  useSummerError,
  useSummerActions,
} from "../../_store/useSummerStore";
import ProductCard from "./ProductsCard";
import type {
  Category,
  ProductWithRelations,
} from "../../_store/useSummerStore";

const SummerCollectionPage: React.FC = () => {
  const summerProducts = useSummerProducts();
  const loading = useSummerLoading();
  const error = useSummerError();
  const { fetchSummerCollection } = useSummerActions();

  const isProductsEmpty = useMemo(
    () => Object.values(summerProducts).every(arr => arr.length === 0),
    [summerProducts]
  );

  const nonEmptyCategories = useMemo(
    () =>
      Object.entries(summerProducts).filter(
        ([_, products]) => products.length > 0
      ) as [Category, ProductWithRelations[]][],
    [summerProducts]
  );

  const allProducts = useMemo(
    () =>
      nonEmptyCategories.reduce(
        (acc, [_, products]) => [...acc, ...products],
        [] as ProductWithRelations[]
      ),
    [nonEmptyCategories]
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
    <div>
      {allProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold">
            No products available in the summer collection.
          </h2>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {allProducts.map(product => (
            <div key={product.id} className="w-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default React.memo(SummerCollectionPage);
