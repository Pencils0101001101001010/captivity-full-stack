"use client";

import React, { useState, useEffect, useCallback } from "react";
import { VendorVariation } from "@prisma/client";
import {
  VendorProductWithRelations,
  VendorProductImageProps,
  VendorDynamicPricingRule,
} from "./types";
import Link from "next/link";
import {
  VendorColorSelector,
  VendorQuantitySelector,
  VendorSizeSelector,
} from "./VendorProductSelectors";
import VendorProductImage from "./VendorProductImage";
import { Button } from "@/components/ui/button";

const transformVendorProductForImage = (
  product: VendorProductWithRelations
): VendorProductImageProps["product"] => ({
  id: product.id,
  productName: product.productName,
  featuredImage: product.featuredImage
    ? {
        thumbnail: product.featuredImage.medium,
        medium: product.featuredImage.medium,
        large: product.featuredImage.medium,
      }
    : null,
  variations: product.variations.map(variation => ({
    id: variation.id,
    color: variation.color,
    variationImageURL: variation.variationImageURL,
  })),
});

type Props = {
  product: VendorProductWithRelations;
  vendorWebsite: string;
};

const VendorProductDetails: React.FC<Props> = ({ product, vendorWebsite }) => {
  const [selectedVariation, setSelectedVariation] =
    useState<VendorVariation | null>(product.variations[0] || null);
  const [quantity, setQuantity] = useState(1);
  const [recommendedBranding, setRecommendedBranding] = useState<string | null>(
    null
  );

  const calculateDynamicPrice = useCallback(
    (quantity: number) => {
      if (!product.dynamicPricing || product.dynamicPricing.length === 0) {
        return product.sellingPrice;
      }

      const applicableRule = product.dynamicPricing.find(
        (rule: VendorDynamicPricingRule) => {
          const from = parseInt(rule.from);
          const to = parseInt(rule.to);
          return quantity >= from && quantity <= to;
        }
      );

      if (!applicableRule) {
        return product.sellingPrice;
      }

      if (applicableRule.type === "fixed_price") {
        return parseFloat(applicableRule.amount);
      } else {
        const discount = parseFloat(applicableRule.amount) / 100;
        return product.sellingPrice * (1 - discount);
      }
    },
    [product.dynamicPricing, product.sellingPrice]
  );

  const [currentPrice, setCurrentPrice] = useState(() =>
    calculateDynamicPrice(quantity)
  );

  useEffect(() => {
    const match = product.description.match(
      /<strong><em>(.*?)<\/em><\/strong>/
    );
    if (match && match[1]) {
      setRecommendedBranding(match[1]);
    }
  }, [product.description]);

  useEffect(() => {
    const newPrice = calculateDynamicPrice(quantity);
    setCurrentPrice(newPrice);
  }, [quantity, calculateDynamicPrice]);

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

  const handleAddToCart = () => {
    if (!selectedVariation) {
      console.log("Please select a variation first");
      return;
    }

    const cartItem = {
      productId: product.id,
      productName: product.productName,
      variation: {
        id: selectedVariation.id,
        color: selectedVariation.color,
        size: selectedVariation.size,
        sku: selectedVariation.sku,
        sku2: selectedVariation.sku2,
        quantity: quantity,
        variationImageURL: selectedVariation.variationImageURL,
      },
      price: currentPrice,
      totalPrice: currentPrice * quantity,
      image:
        selectedVariation.variationImageURL || product.featuredImage?.medium,
      originalPrice: product.sellingPrice,
      priceDiscount: product.sellingPrice - currentPrice,
    };

    console.log("Adding to cart:", cartItem);
  };

  const transformedProduct = transformVendorProductForImage(product);

  const getDynamicPricingInfo = () => {
    if (!product.dynamicPricing || product.dynamicPricing.length === 0) {
      return null;
    }

    return (
      <div className="mt-2 text-sm text-muted-foreground">
        <p className="font-medium">Bulk Pricing Available:</p>
        {product.dynamicPricing.map((rule, index) => (
          <p key={index}>
            {rule.from}-{rule.to} items:{" "}
            {rule.type === "fixed_price"
              ? `R${parseFloat(rule.amount).toFixed(2)}`
              : `${rule.amount}% off`}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-3 bg-card my-8 shadow-2xl shadow-black rounded-lg border border-border mb-20">
      <div className="flex flex-col md:flex-row mb-4">
        <VendorProductImage
          selectedVariation={selectedVariation}
          product={transformedProduct}
          uniqueColors={uniqueColors}
          onColorSelect={handleColorSelect}
        />

        <div className="w-full md:w-1/2">
          <h1 className="text-2xl font-bold mb-1 text-card-foreground">
            {product.productName}
          </h1>
          <div
            dangerouslySetInnerHTML={{ __html: product.description }}
            className="mb-4 text-muted-foreground"
          />
          <div className="mb-2">
            <p className="text-2xl font-bold text-card-foreground">
              R{currentPrice.toFixed(2)}
            </p>
            {currentPrice !== product.sellingPrice && (
              <p className="text-sm text-muted-foreground line-through">
                Discounted: R{product.sellingPrice.toFixed(2)}
              </p>
            )}
            {getDynamicPricingInfo()}
          </div>

          <VendorColorSelector
            colors={uniqueColors}
            selectedColor={selectedVariation?.color}
            variations={product.variations}
            onColorSelect={handleColorSelect}
            productName={product.productName}
          />

          <VendorSizeSelector
            sizes={uniqueSizes}
            selectedSize={selectedVariation?.size}
            onSizeSelect={handleSizeSelect}
          />

          <VendorQuantitySelector
            quantity={quantity}
            maxQuantity={selectedVariation?.quantity || 1}
            onQuantityChange={handleQuantityChange}
          />

          <p className="mb-4 text-muted-foreground">
            {selectedVariation?.quantity || 0} in stock
          </p>

          <div className="space-y-2">
            <Button
              onClick={handleAddToCart}
              className="w-full h-12 bg-[#2c3e50] text-white hover:bg-[#34495e]"
              disabled={!selectedVariation || quantity < 1}
            >
              Add to Cart
            </Button>

            <Button asChild variant="destructive" className="w-full h-12">
              <Link href={`/vendor/${vendorWebsite}/shopping/checkout`}>
                Proceed to Checkout
              </Link>
            </Button>

            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Product Information</h3>
              <p className="text-sm text-muted-foreground">
                SKU: {selectedVariation?.sku || "N/A"}
              </p>
              {selectedVariation?.sku2 && (
                <p className="text-sm text-muted-foreground">
                  SKU 2: {selectedVariation.sku2}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Last Updated: {new Date(product.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProductDetails;
