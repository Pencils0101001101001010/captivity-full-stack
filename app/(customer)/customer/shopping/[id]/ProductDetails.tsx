"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Product, Variation } from "@prisma/client";
import useCartStore from "../../_store/useCartStore";

type ProductWithRelations = Product & {
  variations: Variation[];
  featuredImage: { medium: string } | null;
};

type ProductDetailsProps = {
  product: ProductWithRelations;
};

const AddToCartButton: React.FC<{
  selectedVariation: Variation | null;
  quantity: number;
  disabled: boolean;
}> = ({ selectedVariation, quantity, disabled }) => {
  const addToCart = useCartStore(state => state.addToCart);
  const isLoading = useCartStore(state => state.isLoading);

  const handleAddToCart = async () => {
    if (selectedVariation) {
      await addToCart(selectedVariation.id, quantity);
    }
  };

  return (
    <button
      className="w-full bg-blue-600 text-white py-3 rounded-md font-medium transition-colors hover:bg-blue-700 disabled:bg-gray-400"
      disabled={disabled || isLoading}
      onClick={handleAddToCart}
    >
      {isLoading ? "Adding to Cart..." : "Add to Cart"}
    </button>
  );
};

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    product.variations[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [recommendedBranding, setRecommendedBranding] = useState<string | null>(
    null
  );

  useEffect(() => {
    const match = product.description.match(
      /<strong><em>(.*?)<\/em><\/strong>/
    );
    if (match && match[1]) {
      setRecommendedBranding(match[1]);
    }
  }, [product.description]);

  const handleColorSelect = (color: string) => {
    const newVariation = product.variations.find(
      v => v.color === color && v.size === selectedVariation?.size
    );
    if (newVariation) {
      setSelectedVariation(newVariation);
      setQuantity(1);
    }
  };

  const handleSizeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const size = e.target.value;
    const newVariation = product.variations.find(
      v => v.size === size && v.color === selectedVariation?.color
    );
    if (newVariation) {
      setSelectedVariation(newVariation);
      setQuantity(1);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(Math.min(newQuantity, selectedVariation?.quantity || 1));
  };

  const uniqueColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );

  const uniqueSizes = Array.from(new Set(product.variations.map(v => v.size)));

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white shadow-lg rounded-lg">
      <div className="flex flex-col md:flex-row mb-6">
        <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-6 md:mb-0">
          <div className="relative w-full h-[360px] mb-4">
            <Image
              src={
                selectedVariation?.variationImageURL ||
                product.featuredImage?.medium ||
                "/placeholder-image.jpg"
              }
              alt={product.productName}
              fill
              sizes="(max-width: 768px) 90vw, 40vw"
              style={{ objectFit: "cover" }}
              className="rounded-lg"
              priority
            />
          </div>
          <div className="flex flex-wrap -mx-2">
            {uniqueColors.map(color => {
              const variation = product.variations.find(v => v.color === color);
              return variation ? (
                <div key={variation.id} className="w-1/4 px-2 mb-4">
                  <div
                    className={`relative w-full pt-[100%] cursor-pointer rounded-md overflow-hidden ${
                      selectedVariation?.color === color
                        ? "ring-2 ring-blue-500"
                        : ""
                    }`}
                    onClick={() => handleColorSelect(color)}
                  >
                    <Image
                      src={variation.variationImageURL}
                      alt={`${product.productName} - ${color}`}
                      fill
                      sizes="(max-width: 768px) 25vw, 8.5vw"
                      style={{ objectFit: "cover" }}
                      priority
                    />
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-1 text-gray-800">
            {product.productName}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="mb-6 text-gray-600"
          />
          <p className="text-2xl font-bold mb-2 text-gray-800">
            R{product.sellingPrice.toFixed(2)}
          </p>

          <div className="mb-2">
            <p className="font-bold text-gray-700 mb-2">Color</p>
            <div className="flex flex-wrap -mx-1">
              {uniqueColors.map(color => (
                <button
                  key={color}
                  className={`px-4 py-2 m-1 border rounded text-sm font-medium transition-colors
                    ${
                      selectedVariation?.color === color
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                  onClick={() => handleColorSelect(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="size-select"
              className="font-bold text-gray-700 block mb-2"
            >
              Size
            </label>
            <select
              id="size-select"
              value={selectedVariation?.size || ""}
              onChange={handleSizeSelect}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a size</option>
              {uniqueSizes.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="font-bold text-gray-700 block mb-2">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={selectedVariation?.quantity || 1}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <p className="mb-6 text-gray-600">
            {selectedVariation?.quantity || 0} in stock
          </p>

          <AddToCartButton
            selectedVariation={selectedVariation}
            quantity={quantity}
            disabled={!selectedVariation || selectedVariation.quantity < 1}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
