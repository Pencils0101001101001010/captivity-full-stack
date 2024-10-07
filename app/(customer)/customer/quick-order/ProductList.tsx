"use client";
import React, { useState, useEffect } from "react";
import { fetchProducts } from "./actions";
import ProductCard from "./ProductCard"; // Import the separated ProductCard component
import { Button } from "@/components/ui/button";

interface GroupedProduct {
  id: number;
  name: string;
  imageUrls: string[];
  regularPrice: number | null;
  colors: string[];
  sizes: string[];
}

const ProductList = () => {
  const [products, setProducts] = useState<GroupedProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const result = await fetchProducts(currentPage);
      if (result.success) {
        setProducts(result.data);
        setTotalPages(result.totalPages);
        setError(null);
      } else {
        setError(result.error);
      }
      setIsLoading(false);
    };

    loadProducts();
  }, [currentPage]);

  if (isLoading)
    return <div className="text-center py-8 text-2xl">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-2xl text-destructive">
        Error: {error}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">
        Our Products
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <div className="flex justify-center items-center mt-8 space-x-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="btn flex items-center justify-center"
        >
          Previous
        </Button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="btn flex items-center justify-center"
        >
          <span>Next</span>
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
