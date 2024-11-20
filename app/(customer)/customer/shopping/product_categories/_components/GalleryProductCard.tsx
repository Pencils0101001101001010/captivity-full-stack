import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./StarRating";
import { ProductPrice } from "./ProductCardComponents";
import { Badge } from "@/components/ui/badge";
import { Variation } from "@prisma/client";
import ViewMore from "@/app/(customer)/_components/ViewMore";
import ColorPicker from "../../[id]/DetailPageColorPicker";
import { QuantitySelector, SizeSelector } from "../../[id]/ProductSelectors";
import AddToCartButton from "../../[id]/AddToCartButton";
import { ProductWithRelations } from "../types";
import DetailedReviewCard from "../reviews/ReviewSection";

interface GalleryProductCardProps {
  product: ProductWithRelations;
  selectedColor: string | null; // Add this prop for filter sync
  onColorChange?: (color: string | null) => void; // Add this for filter sync
}

const GalleryProductCard: React.FC<GalleryProductCardProps> = ({
  product,
  selectedColor,
  onColorChange,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);

  // Initialize with filtered color if present
  useEffect(() => {
    if (selectedColor) {
      const variation = product.variations.find(
        v => v.color.toLowerCase() === selectedColor.toLowerCase()
      );
      if (variation) {
        setSelectedVariation(variation);
        setSelectedImage(variation.variationImageURL);
      }
    } else {
      setSelectedVariation(product.variations[0]);
      setSelectedImage(null);
    }
  }, [selectedColor, product.variations]);

  // Get all unique images with their associated variations
  const imageVariationMap = React.useMemo(() => {
    const map = new Map<string, Variation>();
    product.variations.forEach(variation => {
      if (variation.variationImageURL) {
        map.set(variation.variationImageURL, variation);
      }
    });
    if (product.featuredImage?.large) {
      map.set(product.featuredImage.large, product.variations[0]);
    }
    return map;
  }, [product]);

  const allImages = Array.from(imageVariationMap.keys());
  const uniqueColors = Array.from(
    new Set(product.variations.map(v => v.color))
  );
  const uniqueSizes = Array.from(new Set(product.variations.map(v => v.size)));
  const totalStock = product.variations.reduce((sum, v) => sum + v.quantity, 0);

  // Update variation when thumbnail is clicked
  const handleThumbnailClick = (image: string) => {
    setSelectedImage(image);
    const variation = imageVariationMap.get(image);
    if (variation) {
      setSelectedVariation(variation);
      onColorChange?.(variation.color); // Sync with global filter
    }
  };

  const handleColorSelect = (color: string | null) => {
    if (!color) {
      setSelectedVariation(null);
      setSelectedImage(null);
      onColorChange?.(null);
      return;
    }

    const newVariation = product.variations.find(
      v => v.color.toLowerCase() === color.toLowerCase()
    );
    if (newVariation) {
      setSelectedVariation(newVariation);
      setSelectedImage(newVariation.variationImageURL);
      setQuantity(1);
      onColorChange?.(color); // Sync with global filter
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

  const mainImageSrc =
    selectedImage ||
    selectedVariation?.variationImageURL ||
    product.featuredImage?.large ||
    "/placeholder.jpg";

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Column - Images */}
        <div className="w-full md:w-1/3 space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
            <Image
              src={mainImageSrc}
              alt={product.productName}
              fill
              sizes="300"
              className="object-cover"
              priority
            />
            <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
              Stock: {selectedVariation?.quantity || totalStock}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {allImages.map((image, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(image)}
                className={`relative aspect-square rounded-md overflow-hidden border-2
                    ${selectedImage === image ? "border-primary" : "border-transparent"}
                    hover:border-primary/50 transition-colors`}
              >
                <Image
                  src={image}
                  alt={`${product.productName} view ${index + 1}`}
                  fill
                  sizes="60"
                  className="object-cover"
                />
              </button>
            ))}
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
              colors={uniqueColors}
              selectedColor={selectedVariation?.color || null}
              onColorChange={handleColorSelect}
            />

            <SizeSelector
              sizes={uniqueSizes}
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
                href={`/customer/shopping/${product.id}/${selectedVariation?.id || ""}`}
                variant="default"
                size="md"
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

export default GalleryProductCard;
