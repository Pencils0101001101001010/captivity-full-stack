"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Product } from "@prisma/client";
import { formatDescription } from "@/lib/utils";
import AddToCart from "./AddToCart";

interface ProductCardProps {
  product: Product & {
    availableSizes: string[]; // Sizes from the database
    availableColors: string[]; // Colors from the database
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>(""); // State for size
  const [selectedColor, setSelectedColor] = useState<string>(""); // State for color

  return (
    <Card className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-6 bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Product Image */}
      <div className="md:col-span-1 flex items-center justify-center bg-gray-100 p-6">
        {product.imageUrl && (
          <div className="relative w-full h-[300px]">
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
      <div className="md:col-span-3 p-6 space-y-4">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-800">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Column 1 */}
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>SKU:</strong> {product.sku}
              </p>
              <p className="text-gray-600">
                <strong>Type:</strong> {product.type}
              </p>
              <p className="text-gray-600">
                <strong>Published:</strong> {product.published ? "Yes" : "No"}
              </p>
              <p className="text-gray-600">
                <strong>Featured:</strong> {product.isFeatured ? "Yes" : "No"}
              </p>
              <p className="text-gray-600">
                <strong>Visibility:</strong> {product.visibility}
              </p>
              <p className="text-gray-600">
                <strong>In Stock:</strong> {product.inStock ? "Yes" : "No"}
              </p>
              {product.regularPrice !== null && (
                <p className="text-lg text-green-600 font-semibold">
                  Regular Price: ${product.regularPrice.toFixed(2)}
                </p>
              )}
            </div>

            {/* Column 2 */}
            <div className="space-y-2">
              <p className="text-gray-600">
                <strong>Backorders Allowed:</strong>{" "}
                {product.backordersAllowed ? "Yes" : "No"}
              </p>
              <p className="text-gray-600">
                <strong>Sold Individually:</strong>{" "}
                {product.soldIndividually ? "Yes" : "No"}
              </p>
              <p className="text-gray-600">
                <strong>Allow Reviews:</strong>{" "}
                {product.allowReviews ? "Yes" : "No"}
              </p>
              <p className="text-gray-600">
                <strong>Categories:</strong> {product.categories}
              </p>
              <p className="text-gray-600">
                <strong>Tags:</strong> {product.tags}
              </p>
              <p className="text-gray-600">
                <strong>Position:</strong> {product.position}
              </p>
            </div>

            {/* Column 3 */}
            <div className="space-y-2">
              {product.attribute1Name && (
                <p className="text-gray-600">
                  <strong>{product.attribute1Name}:</strong>{" "}
                  {product.attribute1Values}
                </p>
              )}
            </div>
          </div>

          {/* Dropdown for Size */}
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

          {/* Dropdown for Color */}
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

          {/* Short Description */}
          <div className="mt-4">
            <strong className="text-gray-700">Short Description:</strong>
            <div
              className="mt-2 pl-4 text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={formatDescription(
                product.shortDescription
              )}
            />
          </div>
        </CardContent>

        {/* Add to Cart Button */}
        <CardFooter className="pt-4">
          <AddToCart
            selectedSize={selectedSize}
            selectedColor={selectedColor}
          />
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProductCard;
