'use client';
import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { fetchProducts } from './actions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FixedSizeList as List } from 'react-window';
import { CSSProperties } from 'react'; // For the style type
import { ScrollArea } from '@/components/ui/scroll-area';

// Type for GroupedProduct data
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

// ScrollableSelect component props
interface ScrollableSelectProps {
  value: number;
  onValueChange: (value: string) => void;
  maxQuantity: number;
}

// RowProps for individual items in the virtualized list
interface RowProps {
  index: number;
  style: CSSProperties;
}

const ScrollableSelect: React.FC<ScrollableSelectProps> = ({
  value,
  onValueChange,
  maxQuantity,
}) => {
  // Render function to render each quantity in the list
  const renderRow = ({ index, style }: RowProps) => (
    <div style={style}>
      {' '}
      {/* This is the required wrapper for the List */}
      <SelectItem key={index} value={(index + 1).toString()}>
        {index + 1}
      </SelectItem>
    </div>
  );

  return (
    <Select value={value.toString()} onValueChange={onValueChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="Quantity" />
      </SelectTrigger>
      <SelectContent>
        <ScrollArea className="h-[200px]">
          <List height={200} itemCount={maxQuantity} itemSize={35} width={100}>
            {(
              { index, style } // Pass a single function here, not JSX children
            ) => (
              <div style={style}>
                <SelectItem key={index} value={(index + 1).toString()}>
                  {index + 1}
                </SelectItem>
              </div>
            )}
          </List>
        </ScrollArea>
      </SelectContent>
    </Select>
  );
};

const ProductList = () => {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSizes, setSelectedSizes] = useState<{ [key: string]: string }>(
    {}
  );
  const [selectedQuantities, setSelectedQuantities] = useState<{
    [key: string]: number;
  }>({});

  const loadProducts = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchProducts(page);
      if (result.success && result.data) {
        setGroupedProducts(result.data.products);
        setTotalPages(result.data.totalPages);
        // Initialize selected sizes and quantities
        const initialSizes: { [key: string]: string } = {};
        const initialQuantities: { [key: string]: number } = {};
        result.data.products.forEach(product => {
          initialSizes[product.baseProduct] = product.variants[0]?.size || '';
          initialQuantities[product.baseProduct] = 1;
        });
        setSelectedSizes(initialSizes);
        setSelectedQuantities(initialQuantities);
      } else {
        throw new Error(
          result.error || 'An error occurred while fetching products'
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts(currentPage);
  }, [loadProducts, currentPage]);

  const handleSizeChange = (productName: string, size: string) => {
    setSelectedSizes(prev => ({ ...prev, [productName]: size }));
    setSelectedQuantities(prev => ({ ...prev, [productName]: 1 })); // Reset quantity when size changes
  };

  const handleQuantityChange = (productName: string, quantity: number) => {
    setSelectedQuantities(prev => ({ ...prev, [productName]: quantity }));
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {groupedProducts.map(product => {
        const selectedSize = selectedSizes[product.baseProduct];
        const selectedVariant = product.variants.find(
          v => v.size === selectedSize
        );
        const maxQuantity = selectedVariant?.stock || 0;

        return (
          <div
            key={product.baseProduct}
            className="flex mb-8 border-b pb-8 shadow-lg rounded-lg overflow-hidden"
          >
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
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                {product.baseProduct}
              </h2>
              <p className="mb-4 text-gray-600">{product.shortDescription}</p>
              <div className="flex justify-between items-center">
                <div>
                  {product.regularPrice && (
                    <span className="text-2xl font-bold text-green-600">
                      R{product.regularPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <Select
                    value={selectedSize}
                    onValueChange={size =>
                      handleSizeChange(product.baseProduct, size)
                    }
                  >
                    <div>
                      <h1>
                        <p></p>
                      </h1>
                    </div>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.variants.map(variant => (
                        <SelectItem key={variant.sku} value={variant.size}>
                          {variant.size} (
                          {variant.stock !== null
                            ? `${variant.stock} in stock`
                            : 'Out of stock'}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ScrollableSelect
                    value={selectedQuantities[product.baseProduct]}
                    onValueChange={quantity =>
                      handleQuantityChange(
                        product.baseProduct,
                        parseInt(quantity)
                      )
                    }
                    maxQuantity={maxQuantity}
                  />
                  <Badge
                    variant={maxQuantity > 0 ? 'default' : 'destructive'}
                    className={
                      maxQuantity > 0 ? 'bg-green-500 hover:bg-green-600' : ''
                    }
                  >
                    {maxQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={maxQuantity === 0}
                  >
                    Add to Basket
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

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
