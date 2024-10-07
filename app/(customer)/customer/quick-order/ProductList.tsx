"use client";

import React, { useState, useEffect } from "react";
import { fetchProducts } from "./actions";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface GroupedProduct {
  id: number;
  name: string;
  imageUrls: string[];
  regularPrice: number | null;
  sizes: string[];
}

const ProductCard = ({ product }: { product: GroupedProduct }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const handleMouseEnter = () => {
    if (product.imageUrls.length > 1) {
      setCurrentImageIndex(1);
    }
  };

  const handleMouseLeave = () => {
    setCurrentImageIndex(imageError ? 1 : 0);
  };

  const handleImageError = () => {
    if (currentImageIndex === 0 && product.imageUrls.length > 1) {
      setCurrentImageIndex(1);
      setImageError(true);
    }
  };

  return (
    <Link href={`/customer/quick-order/${product.id}`}>
      <Card
        className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <CardHeader className="bg-primary text-primary-foreground">
          <h2 className="text-lg font-bold truncate">{product.name}</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative w-full h-64">
            {product.imageUrls.length > 0 ? (
              <Image
                src={product.imageUrls[currentImageIndex]}
                alt={product.name}
                width={200}
                height={200}
                className="transition-opacity duration-300 w-full h-[250px]"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>
          <div className="p-4">
            <p className="font-bold text-2xl text-primary">
              ${product.regularPrice?.toFixed(2)}
            </p>
          </div>
        </CardContent>
        <CardFooter className="bg-secondary">
          <div className="w-full">
            <p className="text-sm text-secondary-foreground">
              Sizes: {product.sizes.join(", ")}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

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
