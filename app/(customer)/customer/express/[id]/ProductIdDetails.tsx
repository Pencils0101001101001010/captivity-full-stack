"use client";
// app/(customer)/customer/express/[id]/ProductIdDetails.tsx
import React, { useState, useEffect } from "react";
import { Product, Variation } from "../types";

interface ProductIdDetailsProps {
  product: Product;
}

const ProductIdDetails: React.FC<ProductIdDetailsProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [stock, setStock] = useState(0);

  // Get unique variations based on color
  const uniqueVariations = product.variations.reduce((acc, current) => {
    const x = acc.find(item => item.color === current.color);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as Variation[]);

  const uniqueColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );

  const sizes = Array.from(
    new Set(
      product.variations.filter(v => v.color === selectedColor).map(v => v.size)
    )
  );

  useEffect(() => {
    if (uniqueColors.length > 0) {
      setSelectedColor(uniqueColors[0]);
    }
  }, []);

  useEffect(() => {
    if (sizes.length > 0) {
      setSelectedSize(sizes[0]);
    } else {
      setSelectedSize("");
    }
  }, [selectedColor]);

  useEffect(() => {
    const currentVariation = product.variations.find(
      v => v.color === selectedColor && v.size === selectedSize
    );
    setStock(currentVariation ? currentVariation.quantity : 0);
  }, [selectedColor, selectedSize]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSize(e.target.value);
    setQuantity(1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuantity(parseInt(e.target.value));
  };

  const currentVariation = product.variations.find(
    v => v.color === selectedColor && v.size === selectedSize
  );

  if (!product.isPublished) {
    return <div>This product is currently not available.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <h2 className="text-xl mb-4">{product.productName}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={
              currentVariation?.variationImageURL ||
              product.featuredImage?.large
            }
            alt={product.productName}
            className="w-full h-auto mb-4"
          />
          <div className="grid grid-cols-3 gap-2">
            {uniqueVariations.map(variation => (
              <img
                key={variation.id}
                src={variation.variationImageURL}
                alt={`${product.productName} - ${variation.color}`}
                className={`w-full h-auto cursor-pointer border-2 ${
                  selectedColor === variation.color
                    ? "border-blue-500"
                    : "border-gray-200"
                }`}
                onClick={() => handleColorChange(variation.color)}
              />
            ))}
          </div>
        </div>
        <div>
          <div
            className="mb-2"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          <p className="font-bold mb-2">
            Recommended Branding:{" "}
            {product.dynamicPricing[0]?.type || "Embroidery"}
          </p>
          <p className="text-xl font-bold mb-4">
            R{product.sellingPrice.toFixed(2)}
          </p>

          <div className="mb-4">
            <label className="block font-bold mb-2">Color</label>
            <div className="flex flex-wrap gap-2">
              {uniqueColors.map(color => (
                <button
                  key={color}
                  className={`px-4 py-2 border rounded ${
                    selectedColor === color
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => handleColorChange(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="size" className="block font-bold mb-2">
              Size
            </label>
            <select
              id="size"
              className="w-full p-2 border rounded"
              value={selectedSize}
              onChange={handleSizeChange}
            >
              <option value="">Select a size</option>
              {sizes.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="quantity" className="block font-bold mb-2">
              Quantity
            </label>
            <select
              id="quantity"
              className="w-full p-2 border rounded"
              value={quantity}
              onChange={handleQuantityChange}
            >
              {[...Array(Math.min(10, stock))].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <p className="mb-4">{stock} in stock</p>

          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mb-2">
            Add to Cart
          </button>
          <button className="w-full bg-gray-200 text-blue-600 py-2 px-4 rounded hover:bg-gray-300">
            Go to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductIdDetails;
