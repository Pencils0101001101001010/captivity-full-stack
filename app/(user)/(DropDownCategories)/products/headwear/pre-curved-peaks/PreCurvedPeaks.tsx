"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SideMenu from "@/app/(user)/_components/SideMenu";
import HeroSection from "@/app/(user)/_components/HeroSection";
import usePreCurvedPeaks from "./usePreCurvedPeaks";
import type { ProductWithFeaturedImage } from "./actions";
import ProductCarousel from "@/app/(user)/_components/ProductCarousal";
import { CollectionsMenu } from "../../../../_components/CollectionsMenu";

const ITEMS_PER_PAGE = 6;

const PreCurvedPeaksProductList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { products, loading, error } = usePreCurvedPeaks();
  const [featuredImage, setFeaturedImage] = useState<{ large: string }>({
    large: "/Industrial-collection-Btn.jpg",
  });

  // Memoize pagination calculations
  const { paginatedProducts, totalPages, startIndex } = useMemo(() => {
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
    return { paginatedProducts, totalPages, startIndex };
  }, [products, currentPage]);

  useEffect(() => {
    if (products.length > 0 && products[1]?.featuredImage?.large) {
      setFeaturedImage({ large: products[1].featuredImage.large });
    }
  }, [products]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="mx-auto my-3 animate-spin h-8 w-8" />
        <p className="text-muted-foreground">Loading pre-curved peaks collection...</p>
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;

  return (
    <section className="container mx-auto my-8">
      <HeroSection featuredImage={featuredImage} categoryName="PRE-CURVED PEAKS" />

      <div className="flex flex-col md:flex-row gap-12 relative">
        <aside className="md:w-1/4 lg:w-1/5 hidden md:block">
          <div className="sticky top-4 space-y-8">
            <SideMenu />
            <div className="bg-background rounded-lg shadow-sm w-full pl-6">
              <CollectionsMenu products={products} loading={loading} />
              <div className="mt-8">
                <ProductCarousel />
              </div>
            </div>
          </div>
        </aside>

        <main className="w-full md:w-3/4 lg:w-4/5 pl-8">
          <h1 className="text-gray-500 text-xl mb-6">Pre-curved Peaks</h1>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-foreground">
                No pre-curved peaks available in the collection.
              </h2>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {paginatedProducts.map((product: ProductWithFeaturedImage) => (
                  <Link
                    href={`/products/headwear/${product.id}`}
                    key={product.id}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <div className="relative h-48 w-full">
                        <Image
                          src={
                            product.featuredImage?.medium ||
                            "/Industrial-collection-Btn.jpg"
                          }
                          alt={product.productName}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: "cover" }}
                          className="rounded-t-lg"
                          priority
                        />
                      </div>
                      <CardContent className="p-4">
                        <h2 className="text-lg font-semibold mb-2 truncate">
                          {product.productName}
                        </h2>
                      </CardContent>
                      <CardFooter>
                        <p>click to view</p>
                      </CardFooter>
                    </Card>
                  </Link>
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
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
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

              <div className="text-sm text-muted-foreground text-center mt-4">
                Showing {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, products.length)} of{" "}
                {products.length} products
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
};

export default PreCurvedPeaksProductList;
