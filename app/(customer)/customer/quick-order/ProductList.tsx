"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { fetchProducts } from './actions';
import { Input } from '@/components/ui/input';

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

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchProducts(1);
      if (result.success && result.data) {
        setGroupedProducts(result.data.products);
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
    loadProducts();
  }, [loadProducts]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {groupedProducts.map((product) => (
        <div key={product.baseProduct} className="flex mb-8 border-b pb-8">
          <div className="w-1/6">
            <Image 
              src={product.imageUrl} 
              alt={product.baseProduct} 
              width={100} 
              height={100} 
              objectFit="cover"
            />
          </div>
          <div className="w-5/6 pl-4">
            <h2 className="text-xl font-bold text-red-600 mb-2">{product.baseProduct}</h2>
            <p className="mb-4 text-sm text-gray-600">{product.shortDescription}</p>
            <div className="flex justify-between items-center">
              <div>
                {product.regularPrice && (
                  <span className="text-xl font-bold text-green-600">R{product.regularPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center">
                <span className="mr-4">Size</span>
                <select className="border rounded px-2 py-1 mr-2">
                  {product.variants.map((variant) => (
                    <option key={variant.sku} value={variant.size}>
                      {variant.size} ({variant.stock !== null ? `${variant.stock} in stock` : 'Out of stock'})
                    </option>
                  ))}
                </select>
                <Input type="number" defaultValue={1} min={1} className="border rounded w-16 px-2 py-1 mr-2" />
                <button className="bg-gray-800 text-white px-4 py-2 rounded">ADD TO BASKET</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;