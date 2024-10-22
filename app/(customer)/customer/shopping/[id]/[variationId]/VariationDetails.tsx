"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { VariationWithRelations } from "./types";

interface Props {
  data: VariationWithRelations;
}

const VariationDetails: React.FC<Props> = ({ data }) => {
  const { product } = data;
  const uniqueColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );
  const uniqueSizes = Array.from(new Set(product.variations.map(v => v.size)));

  const [selectedColors, setSelectedColors] = useState<Set<string>>(
    new Set([data.color])
  );
  const [selectedSizes, setSelectedSizes] = useState<Set<string>>(
    new Set([data.size])
  );

  const toggleColorFilter = (color: string) => {
    setSelectedColors(prev => {
      const newSet = new Set(prev);
      if (newSet.has(color)) {
        newSet.delete(color);
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
        if (newSet.size === 0) newSet.add(data.size);
      } else {
        newSet.add(size);
      }
      return newSet;
    });
  };

  const filteredVariations = product.variations.filter(
    variation =>
      selectedColors.has(variation.color) && selectedSizes.has(variation.size)
  );

  const totalStock = filteredVariations.reduce((sum, v) => sum + v.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">
              {product.productName}
            </h1>
            <div className="mt-2 flex items-center space-x-4 text-sm text-muted-foreground">
              <span>Filtered Stock: {totalStock}</span>
              <span>SKU: {data.sku}</span>
            </div>
          </div>
          <Link
            href={`/customer/shopping/${product.id}`}
            className="inline-flex items-center px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            View product details
          </Link>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-lg p-6 shadow-lg space-y-6">
        {/* Color Filter */}
        <div>
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            FILTER BY COLOUR
          </h2>
          <div className="flex flex-wrap gap-2">
            {uniqueColors.map(color => {
              const count = product.variations.filter(
                v => v.color === color
              ).length;
              return (
                <button
                  key={color}
                  onClick={() => toggleColorFilter(color)}
                  className={`px-4 py-2 rounded-md border transition-colors ${
                    selectedColors.has(color)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-card-foreground border-input hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {color} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Size Filter */}
        <div>
          <h2 className="text-lg font-semibold text-card-foreground mb-4">
            FILTER BY SIZES
          </h2>
          <div className="flex flex-wrap gap-2">
            {uniqueSizes.map(size => (
              <button
                key={size}
                onClick={() => toggleSizeFilter(size)}
                className={`px-4 py-2 rounded-md border transition-colors ${
                  selectedSizes.has(size)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-card-foreground border-input hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Color
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Size
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground">
                  Image
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredVariations.map(variation => (
                <tr
                  key={variation.id}
                  className={`group transition-colors ${
                    variation.id === data.id
                      ? "bg-accent/50"
                      : "hover:bg-accent/10"
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-card-foreground">
                    {variation.color}
                  </td>
                  <td className="px-6 py-4 text-sm text-card-foreground">
                    {variation.sku2}
                  </td>
                  <td className="px-6 py-4 text-sm text-card-foreground">
                    {variation.size}
                  </td>
                  <td className="px-6 py-4 text-sm text-card-foreground">
                    {variation.quantity}
                  </td>
                  <td className="px-6 py-4 text-sm text-card-foreground">
                    {variation.sku}
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-12 w-12 relative rounded-md overflow-hidden">
                      <Image
                        src={variation.variationImageURL}
                        alt={`${variation.color} ${variation.size}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">
          Pricing Information
        </h2>
        <div className="space-y-2 text-card-foreground">
          <p className="flex justify-between items-center">
            <span>Base Price</span>
            <span className="font-semibold">
              R{product.sellingPrice.toFixed(2)}
            </span>
          </p>
          {product.dynamicPricing.map(pricing => (
            <p
              key={pricing.id}
              className="flex justify-between items-center text-muted-foreground"
            >
              <span>{pricing.type}</span>
              <span>
                R{pricing.amount} ({pricing.from} - {pricing.to})
              </span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VariationDetails;
