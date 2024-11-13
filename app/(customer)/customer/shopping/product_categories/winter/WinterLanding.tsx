"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useWinterActions,
  useWinterError,
  useWinterLoading,
  useWinterProducts,
} from "../../../_store/useWinterStore";
import ProductCard from "../_components/ProductsCard";
// color picker
import ColorPicker from "../_components/ColorPicker";
import { Variation } from "@prisma/client";
import ProductCardColorPicker from "../_components/ProductCardColorPicker";

const ITEMS_PER_PAGE = 12;

const WinterCollectionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products: winterProducts, hasInitiallyFetched } = useWinterProducts();
  const loading = useWinterLoading();
  const error = useWinterError();
  const { fetchWinterCollection } = useWinterActions();
  const initializationRef = useRef(false);
  //color picker
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Create flat array of products
  const allProducts = Object.values(winterProducts).flat().filter(Boolean);

  // Color picker
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
      fetchWinterCollection();
    }
  }, [hasInitiallyFetched, fetchWinterCollection]);

  // Reset to first page whenever products array changes (including search)
  useEffect(() => {
    setCurrentPage(1);
  }, [allProducts.length]);

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

  if (loading) return <div>Loading baseball collection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* COLOR PICKER */}
      <div className="mb-8">
        <ColorPicker
          colors={getUniqueColors(allProducts.flatMap(p => p.variations))}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
      </div>

      {allProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground">
            No products found in the winter collection.
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

export default React.memo(WinterCollectionPage);
