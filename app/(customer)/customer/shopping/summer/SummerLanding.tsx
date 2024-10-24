"use client";

import React, { useEffect, useCallback, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useSummerProducts,
  useSummerLoading,
  useSummerError,
  useSummerActions,
} from "../../_store/useSummerStore";
import ProductCard from "./_components/ProductsCard";
import type {
  Category,
  ProductWithRelations,
} from "../../_store/useSummerStore";

const ITEMS_PER_PAGE = 6;

const SummerCollectionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
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

  // Pagination calculations
  const totalPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = allProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
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
          <h2 className="text-2xl font-bold text-foreground">
            No products available in the summer collection.
          </h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {paginatedProducts.map(product => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                      aria-label={`Page ${page}`}
                      aria-current={currentPage === page ? "page" : undefined}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </div>
          )}

          {/* Products Count */}
          <div className="text-sm text-muted-foreground text-center mt-4">
            Showing {startIndex + 1}-
            {Math.min(startIndex + ITEMS_PER_PAGE, allProducts.length)} of{" "}
            {allProducts.length} products
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(SummerCollectionPage);
