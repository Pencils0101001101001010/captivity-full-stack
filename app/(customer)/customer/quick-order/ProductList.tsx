"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { fetchProducts } from './actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type GroupedProduct = {
  baseProduct: string;
  shortDescription: string;
  imageUrl: string;
  regularPrice: number | null;
  variants: Array<{
    size: string;
    stock: number | null;
    sku: string;
  }>;
};

const ProductList = () => {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchProducts(page);
      if (result.success && result.data) {
        setGroupedProducts(result.data.products);
        setTotalPages(result.data.totalPages);
      } else {
        throw new Error(result.error || 'An error occurred while fetching products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(currentPage);
  }, [loadProducts, currentPage]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {groupedProducts.map((product) => (
        <div key={product.baseProduct} className="flex mb-8 border-b pb-8 shadow-lg rounded-lg overflow-hidden">
          <div className="w-1/4 p-4">
            <Image
              src={product.imageUrl}
              alt={product.baseProduct}
              width={200}
              height={200}
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
          <div className="w-3/4 p-4">
            <h2 className="text-2xl font-bold text-red-600 mb-2">{product.baseProduct}</h2>
            <p className="mb-4 text-gray-600">{product.shortDescription}</p>
            <div className="flex justify-between items-center">
              <div>
                {product.regularPrice && (
                  <span className="text-2xl font-bold text-green-600">R{product.regularPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <select className="border rounded px-3 py-2">
                  {product.variants.map((variant) => (
                    <option key={variant.sku} value={variant.size}>
                      {variant.size}
                    </option>
                  ))}
                </select>
                <Badge 
                  variant={product.variants.some(v => v.stock && v.stock > 0) ? "default" : "destructive"}
                  className={product.variants.some(v => v.stock && v.stock > 0) ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  {product.variants.some(v => v.stock && v.stock > 0) ? 'In Stock' : 'Out of Stock'}
                </Badge>
                <Input type="number" defaultValue={1} min={1} className="w-20" />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add to Basket</Button>
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {/* Pagination */}
      <div className="flex justify-center mt-8 space-x-2">
        <Button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="py-2 px-4 border rounded">
          Page {currentPage} of {totalPages}
        </span>
        <Button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProductList;