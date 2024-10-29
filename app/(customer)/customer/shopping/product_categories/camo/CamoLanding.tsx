"use client";

import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Category,
  ProductWithRelations,
  useCamoActions,
  useCamoError,
  useCamoLoading,
  useCamoProducts,
} from "../../../_store/useCamoStore";
import ProductCard from "../_components/ProductsCard";

const ITEMS_PER_PAGE = 6;

const CamoCollectionPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products: camoProducts, hasInitiallyFetched } = useCamoProducts();
  const loading = useCamoLoading();
  const error = useCamoError();
  const { fetchCamoCollection } = useCamoActions();
  const initializationRef = useRef(false);

  // Create flat array of products
  const allProducts = Object.values(camoProducts).flat().filter(Boolean);

  // Initial fetch
  useEffect(() => {
    if (!hasInitiallyFetched && !initializationRef.current) {
      initializationRef.current = true;
      fetchCamoCollection();
    }
  }, [hasInitiallyFetched, fetchCamoCollection]);

  // Reset to first page whenever products array changes (including search)
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
  const currentProducts = allProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  if (loading) return <div>Loading camo collection...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {allProducts.length === 0 ? (
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-foreground">
            No products found in the camo collection.
          </h2>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {currentProducts.map(product => (
              <div key={product.id} className="w-full">
                <ProductCard product={product} />
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

export default React.memo(CamoCollectionPage);
