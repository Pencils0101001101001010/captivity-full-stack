// ProductDetails.tsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Product } from "@prisma/client";
import { ChevronDown } from "lucide-react";
import { formatDescription } from "@/lib/utils";
import Image from "next/image";
import ColorSelector from "./ColorSelector";
import QuantitySelector from "./QuantitySelector";

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  console.log("ProductDetails rendering, product:", product);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(
    product.stock || 0
  );

  const colors = [
    ...new Set(
      product.attribute1Values ? product.attribute1Values.split(", ") : []
    ),
  ];
  const sizes = product.attribute2Values
    ? product.attribute2Values.split(", ")
    : [];
  const images = product.imageUrl.split(", ");

  console.log("Colors:", colors);
  console.log("Sizes:", sizes);
  console.log("Images:", images);

  useEffect(() => {
    console.log("useEffect running");
    const initialColor = product.attribute1Default || colors[0] || "";
    console.log("Setting initial color:", initialColor);
    setSelectedColor(initialColor);
    updateMainImage(initialColor);

    if (sizes.length > 0) {
      const initialSize = product.attribute2Default || sizes[0];
      console.log("Setting initial size:", initialSize);
      setSelectedSize(initialSize);
    }

    setAvailableQuantity(product.stock || 0);
  }, [product, colors, sizes]);

  const updateMainImage = useCallback(
    (color: string) => {
      console.log("Updating main image for color:", color);
      const newImage =
        images.find(img => img.toLowerCase().includes(color.toLowerCase())) ||
        images[0];
      console.log("New main image:", newImage);
      setMainImage(newImage);
    },
    [images]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      console.log("handleColorChange called with color:", color);
      setSelectedColor(prevColor => {
        console.log("Updating color from", prevColor, "to", color);
        return color;
      });
      updateMainImage(color);
    },
    [updateMainImage]
  );

  const handleSizeChange = useCallback((size: string) => {
    console.log("Size changed to:", size);
    setSelectedSize(size);
  }, []);

  const handleQuantityChange = useCallback((newQuantity: number) => {
    console.log("Quantity changed to:", newQuantity);
    setQuantity(newQuantity);
  }, []);

  console.log(
    "Current state - Color:",
    selectedColor,
    "Size:",
    selectedSize,
    "Quantity:",
    quantity
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl bg-white p-6 rounded-lg shadow-lg">
      <div className="lg:w-1/2 space-y-4">
        <Image
          src={mainImage || "/api/placeholder/400/400"}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-auto object-cover rounded-lg shadow-md"
        />
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <Image
              key={index}
              src={img}
              alt={`${product.name} - view ${index + 1}`}
              width={80}
              height={80}
              className="w-20 h-20 object-cover rounded cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      </div>
      <div className="lg:w-1/2 space-y-6">
        <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
        <div
          dangerouslySetInnerHTML={formatDescription(product.shortDescription)}
          className="mt-2 pl-4 description-content"
        />

        <div className="space-y-4">
          {colors.length > 0 && (
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onColorChange={handleColorChange}
            />
          )}

          {sizes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Size
              </label>
              <div className="mt-1 relative">
                <select
                  value={selectedSize}
                  onChange={e => handleSizeChange(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  {sizes.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <ChevronDown className="h-4 w-4" />
                </div>
              </div>
            </div>
          )}

          <QuantitySelector
            availableQuantity={availableQuantity}
            selectedQuantity={quantity}
            onQuantityChange={handleQuantityChange}
          />
        </div>

        <div className="mt-6 space-y-2 text-sm text-gray-600">
          <p>
            <span className="font-semibold">SKU:</span> {product.sku}
          </p>
          <p>
            <span className="font-semibold">Categories:</span>{" "}
            {product.categories}
          </p>
          {product.tags && (
            <p>
              <span className="font-semibold">Tags:</span> {product.tags}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductDetails);
