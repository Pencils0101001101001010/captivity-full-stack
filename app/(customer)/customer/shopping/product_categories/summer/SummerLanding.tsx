"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useSummerActions,
  useSummerError,
  useSummerLoading,
  useSummerProducts,
} from "../../../_store/useSummerStore";
import ProductCard from "../_components/ProductsCard";
import ColorPicker from "../_components/ColorPicker";
import { Variation } from "@prisma/client";
import ProductCardColorPicker from "../_components/ProductCardColorPicker";
import { useColorStore } from "../../../_store/useColorStore";

const ITEMS_PER_PAGE = 12;

const SummerCollectionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products: summerProducts, hasInitiallyFetched } = useSummerProducts();
  const loading = useSummerLoading();
  const error = useSummerError();
  const { fetchSummerCollection } = useSummerActions();
  const initializationRef = useRef(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const setGlobalSelectedColor = useColorStore(state => state.setSelectedColor);

  // Create flat array of products
  const allProducts = Object.values(summerProducts).flat().filter(Boolean);

  //color picker
  const filteredProducts = selectedColor
    ? allProducts.filter(product =>
        product.variations.some(
          variation =>
            variation.color?.toLowerCase() === selectedColor.toLowerCase()
        )
      )
    : allProducts;
  // Get unique colors from products
  const getUniqueColors = (variations: Variation[]): string[] => {
    const colorSet = new Set<string>();
    variations.forEach(variation => {
      if (typeof variation.color === "string") {
        colorSet.add(variation.color);
      }
    });
    return Array.from(colorSet);
  };
  // Initial fetch
  useEffect(() => {
    if (!hasInitiallyFetched && !initializationRef.current) {
      initializationRef.current = true;
      fetchSummerCollection();
    }
  }, [hasInitiallyFetched, fetchSummerCollection]);

  // Reset to first page whenever products array changes (including search)
  useEffect(() => {
    setCurrentPage(1);
  }, [allProducts.length]);

  // Pagination calculations
  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) return <div>Loading summer collection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {" "}
      {/* COLOR PICKER */}
      <div className="mb-8">
        <ColorPicker
          colors={getUniqueColors(allProducts.flatMap(p => p.variations))}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
      </div>
      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground">
            No products found in the summer collection.
          </h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {currentProducts.map(product => (
              <div key={product.id} className="w-full">
                <ProductCardColorPicker
                  product={product}
                  selectedColor={selectedColor}
                />
              </div>
            ))}
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
            {Math.min(startIndex + ITEMS_PER_PAGE, allProducts.length)} of{" "}
            {allProducts.length} products
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(SummerCollectionPage);
