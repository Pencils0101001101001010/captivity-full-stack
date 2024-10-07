"use client";
import React, { useState, useEffect } from "react";
import { fetchProducts } from "./actions";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import SearchField from "../../_components/SearchField";

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
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const result = await fetchProducts(currentPage, 10, searchQuery);
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
  }, [currentPage, searchQuery]);

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
      {/* Flex container for header and search */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Our Products</h1>
        <div className="mt-4 md:mt-0">
          <SearchField onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center my-8 space-x-4">
        <Button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`px-6 py-2 bg-primary text-white font-semibold rounded-lg transition-colors duration-300 ease-in-out hover:bg-primary-dark hover:shadow-md ${
            currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </Button>
        <span className="text-lg font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-6 py-2 bg-primary text-white font-semibold rounded-lg transition-colors duration-300 ease-in-out hover:bg-primary-dark hover:shadow-md ${
            currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductList;
