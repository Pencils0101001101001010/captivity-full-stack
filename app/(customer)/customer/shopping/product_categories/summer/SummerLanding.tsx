"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useSummerActions,
  useSummerError,
  useSummerLoading,
  useSummerProducts,
  useSummerSort,
} from "../../../_store/useSummerStore";
import { Variation } from "@prisma/client";
import ProductCardColorPicker from "../_components/ProductCardColorPicker";

import ProductSortFilter from "../_components/SortCategoriesFilter";
import LayoutSwitcher from "../_components/LayoutSwither";
import DetailedProductCard from "../_components/DetailProductPageCard";
import ColorPicker from "../_components/ColorPicker";
import GalleryProductCard from "../_components/GalleryProductCard";

const ITEMS_PER_PAGE = 12;

const SummerCollectionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products: summerProducts, hasInitiallyFetched } = useSummerProducts();
  const loading = useSummerLoading();
  const error = useSummerError();
  const { fetchSummerCollection } = useSummerActions();
  const initializationRef = useRef(false);

  //Layout switcher
  const [layout, setLayout] = useState<"grid" | "detail" | "gallery">("grid");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  //sort filter--------------------------
  const { sortBy, setSortBy } = useSummerSort();

  // Create flat array of products with category for unique identification
  const allProducts = useMemo(() => {
    const productMap = new Map();

    Object.entries(summerProducts).forEach(([category, products]) => {
      products.forEach(product => {
        // Only add the product if it hasn't been added yet
        if (!productMap.has(product.id)) {
          productMap.set(product.id, {
            ...product,
            displayCategory: category,
          });
        }
      });
    });
    return Array.from(productMap.values());
  }, [summerProducts]);

  // Optimize color filtering with memoization
  const lowercaseSelectedColor = useMemo(
    () => selectedColor?.toLowerCase(),
    [selectedColor]
  );

  //sort filter
  const filteredAndSortedProducts = useMemo(() => {
    let products = lowercaseSelectedColor
      ? allProducts.filter(product =>
          product.variations.some(
            (variation: Variation) =>
              variation.color?.toLowerCase() === lowercaseSelectedColor
          )
        )
      : allProducts;

    switch (sortBy) {
      case "stock-asc": {
        // First calculate and store total stock for each product
        const productsWithStock = products.map(product => {
          const totalStock = product.variations.reduce(
            (total: number, variation: Variation) => total + variation.quantity,
            0
          );
          return {
            ...product,
            totalStock, // Store the calculated total stock
          };
        });

        // Sort by total stock
        const sortedProducts = productsWithStock.sort((a, b) => {
          if (a.totalStock === b.totalStock) {
            return a.productName.localeCompare(b.productName);
          }
          return a.totalStock - b.totalStock;
        });

        return sortedProducts;
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
          return b.totalStock - a.totalStock;
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
  }, [allProducts, lowercaseSelectedColor, sortBy]);
  //-----------------------------------------------------------

  // Get unique colors from products
  const uniqueColors = useMemo(() => {
    const colorSet = new Set<string>();
    allProducts.forEach(product =>
      product.variations.forEach((variation: Variation) => {
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
      fetchSummerCollection();
    }
  }, [hasInitiallyFetched, fetchSummerCollection]);

  // Reset to first page whenever products array changes
  useEffect(() => {
    setCurrentPage(1);
  }, [allProducts.length]);

  // Memoize pagination calculations
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

  if (loading) return <div>Loading summer collection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <ColorPicker
            colors={uniqueColors}
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
          <ProductSortFilter currentSort={sortBy} onSortChange={setSortBy} />
        </div>
        <LayoutSwitcher layout={layout} onLayoutChange={setLayout} />
      </div>

      {filteredAndSortedProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground">
            No products found in the summer collection.
          </h2>
        </div>
      ) : (
        <>
          {layout === "grid" ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
              {paginationData.currentProducts.map(product => (
                <div
                  key={`${product.displayCategory}-${product.id}`}
                  className="w-full"
                >
                  <ProductCardColorPicker
                    product={product}
                    selectedColor={selectedColor}
                  />
                </div>
              ))}
            </div>
          ) : layout === "detail" ? (
            <div className="space-y-6 mb-8">
              {paginationData.currentProducts.map(product => (
                <DetailedProductCard
                  key={`${product.displayCategory}-${product.id}`}
                  product={product}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-6 mb-8">
              {paginationData.currentProducts.map(product => (
                <GalleryProductCard
                  key={`${product.displayCategory}-${product.id}`}
                  product={product}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              ))}
            </div>
          )}

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
    </>
  );
};

export default React.memo(SummerCollectionPage);
