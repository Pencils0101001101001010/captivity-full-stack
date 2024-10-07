"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@prisma/client";
import AddToCart from "./AddToCart";
import { formatDescription } from "@/lib/utils";

interface ProductCardProps {
  product: Product & {
    availableSizes?: string[]; // List of available sizes
    availableColors?: string[]; // List of available colors
    quantities?: Record<string, number>; // Quantities mapped by size and color (if used)
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [availableQuantity, setAvailableQuantity] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

  // Effect to update available quantity when size/color changes
  useEffect(() => {
    // You can set available quantity based on the product's stock
    if (product.inStock && product.stock) {
      // Here we assume that you have a fixed stock for simplicity
      setAvailableQuantity(product.stock);
      setSelectedQuantity(product.stock > 0 ? 1 : 0); // Reset quantity if no stock
    } else {
      setAvailableQuantity(0);
      setSelectedQuantity(0); // Set to 0 if out of stock
    }
  }, [product]);

  return (
    <Card className="w-full max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Product Image */}
        <div className="md:w-1/2 bg-gray-100 p-6 flex items-center justify-center">
          {product.imageUrl && (
            <div className="relative w-full h-[400px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 space-y-4">
          <CardHeader className="space-y-2 p-0">
            <CardTitle className="text-2xl font-bold text-gray-800">
              {product.name}
            </CardTitle>
            {product.regularPrice !== null && (
              <p className="text-xl font-semibold text-blue-600">
                Price: ${product.regularPrice?.toFixed(2)}
              </p>
            )}
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">
                {product.inStock ? "In Stock" : "Out of stock"}
              </p>
              {product.shortDescription && (
                <div>
                  <strong>Short Description:</strong>
                  <div
                    dangerouslySetInnerHTML={formatDescription(
                      product.shortDescription
                    )}
                    className="mt-2 pl-4 description-content"
                  />
                </div>
              )}
            </div>

            {/* Color Selection */}
            {product.availableColors && product.availableColors.length > 0 && (
              <div className="mt-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Select Color:
                </label>
                <select
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                >
                  <option value="" disabled>
                    Choose a color
                  </option>
                  {product.availableColors.map(color => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Size Selection */}
            {product.availableSizes && product.availableSizes.length > 0 && (
              <div className="mt-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Select Size:
                </label>
                <select
                  value={selectedSize}
                  onChange={e => setSelectedSize(e.target.value)}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                >
                  <option value="" disabled>
                    Choose a size
                  </option>
                  {product.availableSizes.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Quantity Selection */}
            {availableQuantity > 0 && (
              <div className="mt-4">
                <label className="block text-gray-700 font-bold mb-2">
                  Select Quantity:
                </label>
                <select
                  value={selectedQuantity}
                  onChange={e => setSelectedQuantity(Number(e.target.value))}
                  className="block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none"
                >
                  {[...Array(availableQuantity)].map((_, index) => (
                    <option key={index + 1} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="mt-6">
              <AddToCart
                selectedSize={selectedSize}
                selectedColor={selectedColor}
                selectedQuantity={selectedQuantity}
              />
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
