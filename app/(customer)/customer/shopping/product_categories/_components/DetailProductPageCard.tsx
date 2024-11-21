"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { ProductWithRelations } from "../types";
import { Variation } from "@prisma/client";
import { ProductImage, ProductPrice } from "./ProductCardComponents";
import { QuantitySelector, SizeSelector } from "../../[id]/ProductSelectors";
import AddToCartButton from "../../[id]/AddToCartButton";
import ColorPicker from "../../[id]/DetailPageColorPicker";
import { useColorStore } from "../../../_store/useColorStore";
import ViewMore from "@/app/(customer)/_components/ViewMore";
import DetailedReviewCard from "../reviews/ReviewSection";

interface DetailedProductCardProps {
  product: ProductWithRelations;
  selectedColor: string | null;
  onColorChange?: (color: string | null) => void;
}

const DetailedProductCard: React.FC<DetailedProductCardProps> = ({
  product,
  selectedColor,
  onColorChange,
}) => {
  const setGlobalSelectedColor = useColorStore(state => state.setSelectedColor);

  const defaultVariation = product.variations[0];
  const initialVariation = selectedColor
    ? (product.variations.find(
        v => v.color.toLowerCase() === selectedColor.toLowerCase()
      ) ?? defaultVariation)
    : defaultVariation;

  const [selectedVariation, setSelectedVariation] =
    useState<Variation>(initialVariation);
  const [quantity, setQuantity] = useState(1);

  const handleColorChange = useCallback(
    (newColor: string | null) => {
      const variation = newColor
        ? (product.variations.find(
            v => v.color.toLowerCase() === newColor.toLowerCase()
          ) ?? defaultVariation)
        : defaultVariation;

      setSelectedVariation(variation);
      setQuantity(1);

      onColorChange?.(newColor);
      if (newColor) {
        setGlobalSelectedColor(product.id, newColor);
      }
    },
    [
      product.id,
      product.variations,
      defaultVariation,
      onColorChange,
      setGlobalSelectedColor,
    ]
  );

  useEffect(() => {
    handleColorChange(selectedColor);
  }, [selectedColor, handleColorChange]);

  const totalStock = product.variations.reduce(
    (sum, variation) => sum + variation.quantity,
    0
  );

  const handleColorSelect = (color: string | null) => {
    onColorChange?.(color);

    if (!color) {
      setSelectedVariation(defaultVariation);
      return;
    }

    const newVariation = product.variations.find(
      v => v.color.toLowerCase() === color.toLowerCase()
    );

    if (newVariation) {
      setSelectedVariation(newVariation);
      setQuantity(1);
      setGlobalSelectedColor(product.id, color);
    }
  };

  const viewMoreUrl = selectedVariation
    ? `/customer/shopping/${product.id}/${selectedVariation.id}`
    : `/customer/shopping/product/${product.id}`;

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

  return (
    <Card className=" shadow-2xl shadow-black transition-transform duration-300 hover:scale-95 p-3">
      <div className="flex flex-col md:flex-row gap-6  p-3">
        {/* Left Column - Product Image */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              Total Stock: {totalStock}
            </div>
            <ProductImage
              imageSrc={
                selectedVariation?.variationImageURL ||
                product.featuredImage?.large
              }
              alt={product.productName}
            />
          </div>
        </div>

        {/* Right Column - Product Info */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">
              {product.productName}
            </h2>
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm space-y-1">
                <div className="text-muted-foreground">
                  Total Stock: {totalStock}
                </div>
                {selectedVariation && (
                  <div className="text-muted-foreground">
                    Selected Color: {selectedVariation.color}
                    <div>Color Stock: {selectedVariation.quantity}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <ProductPrice
            dynamicPricing={product.dynamicPricing}
            sellingPrice={product.sellingPrice}
          />

          <div className="space-y-4">
            <ColorPicker
              colors={Array.from(new Set(product.variations.map(v => v.color)))}
              selectedColor={selectedVariation?.color || null}
              onColorChange={handleColorSelect}
            />

            <SizeSelector
              sizes={Array.from(new Set(product.variations.map(v => v.size)))}
              selectedSize={selectedVariation?.size}
              onSizeSelect={handleSizeSelect}
            />

            <QuantitySelector
              quantity={quantity}
              maxQuantity={selectedVariation?.quantity || 1}
              onQuantityChange={e => setQuantity(parseInt(e.target.value))}
            />

            <DetailedReviewCard product={product} />

            <div className="space-y-2">
              <AddToCartButton
                selectedVariation={selectedVariation}
                quantity={quantity}
                disabled={!selectedVariation || selectedVariation.quantity < 1}
              />

              <ViewMore
                href={viewMoreUrl}
                variant="default"
                size="md"
                className="w-full"
              >
                View More Details
              </ViewMore>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DetailedProductCard;
