"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import type { VariationWithRelations } from "./actions";

interface Props {
  data: VariationWithRelations;
}

const VariationDetails: React.FC<Props> = ({ data }) => {
  const { product } = data;
  const uniqueColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );
  const uniqueSizes = Array.from(new Set(product.variations.map(v => v.size)));

  // Filter states
  const [selectedColors, setSelectedColors] = useState<Set<string>>(
    new Set([data.color])
  );
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(
    new Set([data.size])
  );

  // Filter handlers
  const toggleColorFilter = (color: string) => {
    setSelectedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(color)) {
        newSet.delete(color);
        // If removing last color, keep current variation's color
        if (newSet.size === 0) newSet.add(data.color);
      } else {
        newSet.add(color);
      }
      return newSet;
    });
  };

  const toggleSizeFilter = (size: string) => {
    setSelectedSizes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(size)) {
        newSet.delete(size);
        // If removing last size, keep current variation's size
        if (newSet.size === 0) newSet.add(data.size);
      } else {
        newSet.add(size);
      }
      return newSet;
    });
  };

  // Filter variations based on selected filters
  const filteredVariations = product.variations.filter(
    variation =>
      selectedColors.has(variation.color) && selectedSizes.has(variation.size)
  );

  // Calculate total stock for filtered variations
  const totalStock = filteredVariations.reduce((sum, v) => sum + v.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {product.productName}
            </h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-gray-600">
              <span>Filtered Stock: {totalStock}</span>
              <span>SKU: {data.sku}</span>
            </div>
          </div>
          <Link
            href={`/customer/shopping/product/${product.id}`}
            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600"
          >
            View product details
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-6 mb-8">
        {/* Color Filter */}
        <div>
          <h2 className="text-gray-700 mb-2">FILTER BY COLOUR:</h2>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map(color => {
              const count = product.variations.filter(
                v => v.color === color
              ).length;
              return (
                <button
                  key={color}
                  onClick={() => toggleColorFilter(color)}
                  className={`px-4 py-2 rounded border transition-colors ${
                    selectedColors.has(color)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {color} {count}
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h2 className="text-gray-700 mb-2">FILTER BY SIZES:</h2>
          <div className="flex flex-wrap gap-2">
            {uniqueSizes.map(size => (
              <button
                key={size}
                onClick={() => toggleSizeFilter(size)}
                className={`px-4 py-2 rounded border transition-colors ${
                  selectedSizes.has(size)
                    ? "bg-cyan-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Variation Details Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Color
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock on Hand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Image
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVariations.map(variation => (
              <tr
                key={variation.id}
                className={`hover:bg-gray-50 ${variation.id === data.id ? "bg-blue-50" : ""}`}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {variation.color}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {variation.sku2}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {variation.size}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {variation.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{variation.sku}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-12 w-12 relative">
                    <Image
                      src={variation.variationImageURL}
                      alt={`${variation.color} ${variation.size}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Price Information */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Pricing</h2>
        <p className="text-gray-700">
          Base Price: R{product.sellingPrice.toFixed(2)}
        </p>
        {product.dynamicPricing.map(pricing => (
          <p key={pricing.id} className="text-gray-700">
            {pricing.type}: R{pricing.amount} ({pricing.from} - {pricing.to})
          </p>
        ))}
      </div>
    </div>
  );
};

export default VariationDetails;
