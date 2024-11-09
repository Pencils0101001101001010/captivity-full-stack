"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useAfricanActions,
  useAfricanError,
  useAfricanLoading,
  useAfricanProducts,
} from "../../../_store/useAfricanStore";
import { ProductWithRelations } from "./actions";
import FilterProductCard from "../_components/FilterProductCard";
import { Variation } from "@prisma/client";

const ITEMS_PER_PAGE = 12;

const AfricanCollectionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products: africanProducts, hasInitiallyFetched } =
    useAfricanProducts();
  const loading = useAfricanLoading();
  const error = useAfricanError();
  const { fetchAfricanCollection } = useAfricanActions();
  const initializationRef = useRef(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Single useEffect for initialization
  useEffect(() => {
    if (!hasInitiallyFetched && !initializationRef.current) {
      initializationRef.current = true;
      fetchAfricanCollection();
    }
  }, [hasInitiallyFetched, fetchAfricanCollection]);

  // Create flat array of products
  const allProducts = Object.values(africanProducts).flat().filter(Boolean);

  // Extract colors per product
  const getUniqueColors = (variations: Variation[]): string[] => {
    const colorSet = new Set<string>();
    variations.forEach(variation => {
      if (typeof variation.color === "string") {
        colorSet.add(variation.color);
      }
    });
    return Array.from(colorSet);
  };

  // Reset to first page whenever products array changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allProducts.length]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(allProducts.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = allProducts.slice(startIndex, endIndex);

  // Filter products by color if selected
  const filteredProducts = selectedColor
    ? allProducts.filter(product =>
        product.variations.some(variation => variation.color === selectedColor)
      )
    : allProducts;

  if (loading) return <div>Loading african collection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground">
            No products found in the african collection.
          </h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {currentProducts.map(product => {
              const colors = getUniqueColors(product.variations);
              return (
                <FilterProductCard
                  key={product.id}
                  product={product}
                  colors={colors}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={safeCurrentPage === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      safeCurrentPage === page
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                      aria-label={`Page ${page}`}
                      aria-current={
                        safeCurrentPage === page ? "page" : undefined
                      }
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(totalPages, prev + 1))
                }
                disabled={safeCurrentPage === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </div>
          )}

          <div className="text-sm text-muted-foreground text-center mt-4">
            Showing {startIndex + 1}-
            {Math.min(endIndex, filteredProducts.length)} of{" "}
            {filteredProducts.length} products
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(AfricanCollectionPage);
