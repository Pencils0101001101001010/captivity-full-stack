"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useIndustrialActions,
  useIndustrialError,
  useIndustrialLoading,
  useIndustrialProducts,
} from "../../../_store/useIndustrialStore";
import ColorPicker from "../_components/ColorPicker";
import ProductCardColorPicker from "../_components/ProductCardColorPicker";

const ITEMS_PER_PAGE = 12;

const IndustrialCollectionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products: industrialProducts, hasInitiallyFetched } =
    useIndustrialProducts();
  const loading = useIndustrialLoading();
  const error = useIndustrialError();
  const { fetchIndustrialCollection } = useIndustrialActions();
  const initializationRef = useRef(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  // Memoize flattened products array
  const allProducts = useMemo(
    () => Object.values(industrialProducts).flat().filter(Boolean),
    [industrialProducts]
  );

  // Memoize lowercase selected color
  const lowercaseSelectedColor = useMemo(
    () => selectedColor?.toLowerCase(),
    [selectedColor]
  );
  // Memoize filtered products
  const filteredProducts = useMemo(
    () =>
      lowercaseSelectedColor
        ? allProducts.filter(product =>
            product.variations.some(
              variation =>
                variation.color?.toLowerCase() === lowercaseSelectedColor
            )
          )
        : allProducts,
    [allProducts, lowercaseSelectedColor]
  );

  // Memoize unique colors
  const uniqueColors = useMemo(() => {
    const colorSet = new Set<string>();
    allProducts.forEach(product =>
      product.variations.forEach(variation => {
        if (typeof variation.color === "string") {
          colorSet.add(variation.color);
        }
      })
    );
    return Array.from(colorSet);
  }, [allProducts]);

  // Initial fetch
  useEffect(() => {
    if (!hasInitiallyFetched && !initializationRef.current) {
      initializationRef.current = true;
      fetchIndustrialCollection();
    }
  }, [hasInitiallyFetched, fetchIndustrialCollection]);

  // Reset to first page whenever products array changes (including search)
  useEffect(() => {
    setCurrentPage(1);
  }, [allProducts.length]);

  // Memoize pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(
      startIndex + ITEMS_PER_PAGE,
      filteredProducts.length
    );
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    return {
      totalPages,
      safeCurrentPage,
      startIndex,
      endIndex,
      currentProducts,
    };
  }, [filteredProducts, currentPage]);

  if (loading) return <div>Loading industrial collection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {/* COLOR PICKER */}
      <div className="mb-8">
        <ColorPicker
          colors={uniqueColors}
          selectedColor={selectedColor}
          onColorChange={setSelectedColor}
        />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground">
            No products found in the winter collection.
          </h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {paginationData.currentProducts.map(product => (
              <div key={product.id} className="w-full">
                <ProductCardColorPicker
                  product={product}
                  selectedColor={selectedColor}
                />
              </div>
            ))}
          </div>

          {paginationData.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={paginationData.safeCurrentPage === 1}
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
              </button>

              <div className="flex gap-2">
                {Array.from(
                  { length: paginationData.totalPages },
                  (_, i) => i + 1
                ).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        paginationData.safeCurrentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted text-foreground"
                      }`}
                    aria-label={`Page ${page}`}
                    aria-current={
                      paginationData.safeCurrentPage === page
                        ? "page"
                        : undefined
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(prev =>
                    Math.min(paginationData.totalPages, prev + 1)
                  )
                }
                disabled={
                  paginationData.safeCurrentPage === paginationData.totalPages
                }
                className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5 text-foreground" />
              </button>
            </div>
          )}

          <div className="text-sm text-muted-foreground text-center mt-4">
            Showing {paginationData.startIndex + 1}-{paginationData.endIndex} of{" "}
            {filteredProducts.length} products
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(IndustrialCollectionPage);
