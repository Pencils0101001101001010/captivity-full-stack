"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SizeSelectorProps {
  categoryProducts: Array<{
    id: number;
    name: string;
    sku: string;
    stock: number | null;
    regularPrice: number | null;
    attribute1Default?: string | null;
    attribute2Default?: string | null;
    inStock: boolean;
  }>;
  attribute1Name: string | null;
  currentSize: string | null;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({
  categoryProducts,
  attribute1Name,
  currentSize,
  onSizeChange,
}: SizeSelectorProps) {
  // Get unique sizes from category products
  const uniqueSizes = Array.from(
    new Set(
      categoryProducts
        .map(product => product.attribute1Default)
        .filter((size): size is string => size !== null && size !== undefined)
    )
  ).sort();

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {attribute1Name || 'Size'}
      </label>
      <Select
        value={currentSize || undefined}
        onValueChange={onSizeChange}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={`Select ${attribute1Name || 'Size'}`} />
        </SelectTrigger>
        <SelectContent>
          {uniqueSizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
              {categoryProducts.find(p => p.attribute1Default === size)?.stock === 0 
                ? ' (Out of Stock)'
                : ''}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}