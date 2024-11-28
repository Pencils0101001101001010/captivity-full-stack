"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useWinterActions,
  useWinterError,
  useWinterLoading,
  useWinterProducts,
  useWinterSort,
} from "../../../_store/useWinterStore";
import { useFilterStore } from "../../../_store/useFilterStore";
import ProductSortFilter from "../_components/SortCategoriesFilter";
import LayoutSwitcher from "../_components/LayoutSwither";
import DetailedProductCard from "../_components/DetailProductPageCard";
import GalleryProductCard from "../_components/GalleryProductCard";
import { Variation } from "@prisma/client";
import ProductCard from "../_components/ProductCardColorPicker";
import { ProductWithRelations } from "../types";

interface EnhancedProduct extends ProductWithRelations {
  displayCategory?: string;
  displayColor?: string;
  totalStock?: number;
}

const ITEMS_PER_PAGE = 12;

const WinterCollectionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products: winterProducts, hasInitiallyFetched } = useWinterProducts();
  const loading = useWinterLoading();
  const error = useWinterError();
  const { fetchWinterCollection } = useWinterActions();
  const { sortBy, setSortBy } = useWinterSort();
  const { selectedColors, selectedSizes } = useFilterStore();
  const [layout, setLayout] = useState<"grid" | "detail" | "gallery">("grid");
  const initializationRef = useRef(false);

  // Create base products array with enhanced typing
  const allProducts = useMemo(() => {
    const productMap = new Map<string, EnhancedProduct>();

    Object.entries(winterProducts).forEach(([category, products]) => {
      products.forEach(product => {
        if (!productMap.has(product.id)) {
          productMap.set(product.id, {
            ...product,
            displayCategory: category,
          });
        }
      });
    });
    return Array.from(productMap.values());
  }, [winterProducts]);

  // Apply filters and sorting
  const filteredAndSortedProducts = useMemo(() => {
    let products: EnhancedProduct[] = [];

    // Start with all products
    let baseProducts = allProducts;

    // Apply size filters first if any
    if (selectedSizes.length > 0) {
      baseProducts = baseProducts.filter(product =>
        product.variations.some((variation: Variation) =>
          selectedSizes.includes(variation.size)
        )
      );
    }

    // Then handle color filtering and duplication
    if (selectedColors.length > 0) {
      baseProducts.forEach(product => {
        selectedColors.forEach(selectedColor => {
          const matchingVariations = product.variations.filter(
            (variation: Variation) =>
              variation.color.toLowerCase() === selectedColor.toLowerCase() &&
              (!selectedSizes.length || selectedSizes.includes(variation.size))
          );

          if (matchingVariations.length > 0) {
            products.push({
              ...product,
              displayColor: selectedColor,
              variations: matchingVariations,
            });
          }
        });
      });
    } else {
      products = baseProducts.map(product => ({
        ...product,
        variations:
          selectedSizes.length > 0
            ? product.variations.filter((v: Variation) =>
                selectedSizes.includes(v.size)
              )
            : product.variations,
      }));
    }

    // Apply sorting
    switch (sortBy) {
      case "stock-asc": {
        const productsWithStock = products.map(product => {
          const totalStock = product.variations.reduce(
            (total: number, variation: Variation) => total + variation.quantity,
            0
          );
          return {
            ...product,
            totalStock,
          };
        });

        return productsWithStock.sort((a, b) => {
          if (a.totalStock === b.totalStock) {
            return a.productName.localeCompare(b.productName);
          }
          return (a.totalStock || 0) - (b.totalStock || 0);
        });
      }

      case "stock-desc": {
        const productsWithStock = products.map(product => {
          const totalStock = product.variations.reduce(
            (total: number, variation: Variation) => total + variation.quantity,
            0
          );
          return {
            ...product,
            totalStock,
          };
        });

        return productsWithStock.sort((a, b) => {
          if (a.totalStock === b.totalStock) {
            return b.productName.localeCompare(a.productName);
          }
          return (b.totalStock || 0) - (a.totalStock || 0);
        });
      }

      case "price-asc":
        return [...products].sort((a, b) => a.sellingPrice - b.sellingPrice);
      case "price-desc":
        return [...products].sort((a, b) => b.sellingPrice - a.sellingPrice);
      case "name-asc":
        return [...products].sort((a, b) =>
          a.productName.localeCompare(b.productName)
        );
      case "name-desc":
        return [...products].sort((a, b) =>
          b.productName.localeCompare(a.productName)
        );
      default:
        return products;
    }
  }, [allProducts, selectedColors, selectedSizes, sortBy]);

  // Pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(
      filteredAndSortedProducts.length / ITEMS_PER_PAGE
    );
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = Math.min(
      startIndex + ITEMS_PER_PAGE,
      filteredAndSortedProducts.length
    );
    const currentProducts = filteredAndSortedProducts.slice(
      startIndex,
      endIndex
    );

    return {
      totalPages,
      safeCurrentPage,
      startIndex,
      endIndex,
      currentProducts,
    };
  }, [filteredAndSortedProducts, currentPage]);

  useEffect(() => {
    if (!hasInitiallyFetched && !initializationRef.current) {
      initializationRef.current = true;
      fetchWinterCollection();
    }
  }, [hasInitiallyFetched, fetchWinterCollection]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedColors, selectedSizes]);

  if (loading) return <div>Loading winter collection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <ProductSortFilter currentSort={sortBy} onSortChange={setSortBy} />
        <LayoutSwitcher layout={layout} onLayoutChange={setLayout} />
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground">
            No products found matching your filters.Try in another
          </h2>
        </div>
      ) : (
        <>
          {layout === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {paginationData.currentProducts.map((product, index) => (
                <div
                  key={`${product.id}-${product.displayColor || index}`}
                  className="w-full"
                >
                  <ProductCard
                    product={product}
                    selectedColors={[product.displayColor || ""]}
                    selectedSizes={selectedSizes}
                  />
                </div>
              ))}
            </div>
          ) : layout === "detail" ? (
            <div className="space-y-6 mb-8">
              {paginationData.currentProducts.map((product, index) => (
                <DetailedProductCard
                  key={`${product.id}-${product.displayColor || index}`}
                  product={product}
                  selectedColors={[product.displayColor || ""]}
                  selectedSizes={selectedSizes}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {paginationData.currentProducts.map((product, index) => (
                <GalleryProductCard
                  key={`${product.id}-${product.displayColor || index}`}
                  product={product}
                  selectedColors={[product.displayColor || ""]}
                  selectedSizes={selectedSizes}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
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
            {filteredAndSortedProducts.length} products
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(WinterCollectionPage);
