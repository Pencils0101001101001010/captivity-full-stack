"use client";
import { useEffect, useState } from "react";
import { fetchGolfersApparel } from "./actions";
import { SidebarNavigation } from "./sidebar-navigation";
import { ProductGrid } from "./product-grid";
import { HeroSection } from "./hero-section";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  imageUrl: string;
  stock: number;
  shortDescription?: string;
}

interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function GolfersApparelProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [metadata, setMetadata] = useState<PaginationMetadata | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const result = await fetchGolfersApparel(currentPage);
      if (result?.success) {
        setProducts(result.data || []);
        setMetadata(result.metadata || null);
        if (result.data && result.data.length > 0) {
          setSelectedProduct(result.data[0]);
        }
      } else {
        setError(result?.error || "Failed to load products");
      }
      setLoading(false);
    }
    loadProducts();
  }, [currentPage]);

  // Simplified page change handler without scroll behavior
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (error) {
    return (
      <div className="container mx-auto my-8 text-center">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {selectedProduct && <HeroSection product={selectedProduct} />}

      <div className="container mx-auto px-4">
        <div className="flex gap-8">
          <SidebarNavigation />
          <div className="flex-1">
            <ProductGrid
              products={products}
              loading={loading}
              onProductHover={setSelectedProduct}
            />

            {metadata && (
              <div className="mt-8 mb-8 flex justify-center">
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!metadata.hasPreviousPage}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {Array.from({ length: metadata.totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      const distance = Math.abs(page - currentPage);
                      return (
                        distance === 0 ||
                        distance === 1 ||
                        page === 1 ||
                        page === metadata.totalPages
                      );
                    })
                    .map((page, index, array) => (
                      <div key={page} className="flex items-center">
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 text-gray-400">•••</span>
                        )}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          className="h-8 w-8 p-0"
                        >
                          {page}
                        </Button>
                      </div>
                    ))}

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!metadata.hasNextPage}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
