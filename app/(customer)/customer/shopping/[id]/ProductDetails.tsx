"use client";

import React, { useState, useEffect } from "react";
import { Variation } from "@prisma/client";
import { ProductDetailsProps } from "./types";
import {
  ColorSelector,
  SizeSelector,
  QuantitySelector,
} from "./ProductSelectors";
import ProductImage from "./ProductImage";
import AddToCartButton from "./AddToCartButton";
import Link from "next/link";
import ViewMore from "@/app/(customer)/_components/ViewMore";

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

  const uniqueColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );

  const uniqueSizes = Array.from(new Set(product.variations.map(v => v.size)));

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

  return (
    <div className="max-w-4xl mx-auto p-3 bg-white my-8 shadow-2xl shadow-black rounded-lg">
      <div className="flex flex-col md:flex-row mb-4">
        <ProductImage
          selectedVariation={selectedVariation}
          product={product}
          uniqueColors={uniqueColors}
          onColorSelect={handleColorSelect}
        />

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-1 text-gray-800">
            {product.productName}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="mb-4 text-gray-600"
          />
          <p className="text-2xl font-bold mb-2 text-gray-800">
            R{product.sellingPrice.toFixed(2)}
          </p>

          <ColorSelector
            colors={uniqueColors}
            selectedColor={selectedVariation?.color}
            variations={product.variations}
            onColorSelect={handleColorSelect}
            productName={product.productName}
          />

          <SizeSelector
            sizes={uniqueSizes}
            selectedSize={selectedVariation?.size}
            onSizeSelect={handleSizeSelect}
          />

          <QuantitySelector
            quantity={quantity}
            maxQuantity={selectedVariation?.quantity || 1}
            onQuantityChange={handleQuantityChange}
          />

          <p className="mb-4 text-gray-600">
            {selectedVariation?.quantity || 0} in stock
          </p>

          <AddToCartButton
            selectedVariation={selectedVariation}
            quantity={quantity}
            disabled={!selectedVariation || selectedVariation.quantity < 1}
          />
          <Link
            href="/customer/shopping/checkout"
            className="block w-full bg-red-600 text-white text-center py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
          >
            Proceed to Checkout
          </Link>

          <ViewMore
            href={`/customer/shopping/varaint/${product.variations}`}
            variant="default"
            size="md"
          >
            View More
          </ViewMore>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
