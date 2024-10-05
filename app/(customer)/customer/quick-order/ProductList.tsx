"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchProducts } from './actions';

type Product = {
  id: number;
  sku: string;
  shortDescription: string;
  attribute1Values: string[] | null;
  attribute2Values: string[] | null;
  imageUrl: string;
  regularPrice: number | null;
  stock: number | null;
};

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts(currentPage);
  }, [currentPage]);

  const loadProducts = async (page: number) => {
    setLoading(true);
    const result = await fetchProducts(page);
    if (result.success && result.data) {
      setProducts(result.data.products);
      setTotalPages(result.data.totalPages);
    } else {
      setError(result.error || 'An error occurred while fetching products');
    }
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
            <div className="relative h-48">
              <Image 
                src={product.imageUrl} 
                alt={product.sku} 
                layout="fill" 
                objectFit="cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{product.sku}</h2>
              <p className="text-gray-600 mb-4">{product.shortDescription}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold text-blue-600">R{product.regularPrice?.toFixed(2)}</span>
                <span className="text-sm text-gray-500">Stock: {product.stock}</span>
              </div>
              {product.attribute1Values && product.attribute1Values.length > 0 && (
                <div className="mb-2">
                  <span className="font-semibold text-gray-700">Colors: </span>
                  <span className="text-gray-600">{product.attribute1Values.join(', ')}</span>
                </div>
              )}
              {product.attribute2Values && product.attribute2Values.length > 0 && (
                <div className="mb-4">
                  <span className="font-semibold text-gray-700">Sizes: </span>
                  <span className="text-gray-600">{product.attribute2Values.join(', ')}</span>
                </div>
              )}
              <button className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
                Add to Basket
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center items-center mt-8 space-x-4">
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="flex items-center px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          <ChevronLeft size={20} />
          <span className="ml-2">Previous</span>
        </button>
        <span className="text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="flex items-center px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          <span className="mr-2">Next</span>
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default ProductList;