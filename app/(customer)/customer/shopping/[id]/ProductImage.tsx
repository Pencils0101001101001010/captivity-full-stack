import React from "react";
import Image from "next/image";
import { ProductImageProps } from "./types";

interface Thumbnail {
  id: string;
  imageUrl: string;
  color: string;
  isSelected: boolean;
}

const ProductImage: React.FC<ProductImageProps> = ({
  selectedVariation,
  product,
  uniqueColors,
  onColorSelect,
}) => {
  // Get the main display image
  const mainImage =
    selectedVariation?.variationImageURL ||
    product.featuredImage?.medium ||
    "/placeholder-image.jpg";

  // Create array of all thumbnail images with proper typing
  const thumbnails: Thumbnail[] = [];

  // Add featured image if it exists
  if (product.featuredImage?.thumbnail) {
    thumbnails.push({
      id: "featured",
      imageUrl: product.featuredImage.thumbnail,
      color: "featured",
      isSelected: !selectedVariation,
    });
  }

  // Add variation thumbnails
  product.variations
    .filter(v => v.variationImageURL)
    .forEach(variation => {
      thumbnails.push({
        id: variation.id,
        imageUrl: variation.variationImageURL,
        color: variation.color,
        isSelected: selectedVariation?.id === variation.id,
      });
    });

  return (
    <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-4 md:mb-0">
      {/* Main Image */}
      <div className="relative w-full h-[340px] mb-4">
        <Image
          src={mainImage}
          alt={product.productName}
          fill
          sizes="(max-width: 768px) 90vw, 40vw"
          style={{ objectFit: "cover" }}
          className="rounded-lg border border-border bg-card"
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="flex flex-wrap -mx-2">
        {thumbnails.map(thumb => (
          <div key={thumb.id} className="w-1/4 px-2 mb-4">
            <div
              className={`relative w-full pt-[100%] cursor-pointer rounded-md overflow-hidden border ${
                thumb.isSelected
                  ? "ring-2 ring-ring border-primary"
                  : "border-border hover:border-primary/50"
              }`}
              onClick={() => {
                if (thumb.id === "featured") {
                  onColorSelect(product.variations[0]?.color || "");
                } else {
                  onColorSelect(thumb.color);
                }
              }}
            >
              <Image
                src={thumb.imageUrl}
                alt={`${product.productName} ${
                  thumb.id === "featured" ? "- Featured" : `- ${thumb.color}`
                }`}
                fill
                sizes="(max-width: 768px) 25vw, 8.5vw"
                style={{ objectFit: "cover" }}
                className="bg-card"
                priority
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;
