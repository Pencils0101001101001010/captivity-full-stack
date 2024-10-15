// components/ImageGallery.tsx
import React from "react";
import Image from "next/image";
import { Variation } from "@prisma/client";

interface ImageGalleryProps {
  product: {
    productName: string;
    featuredImage: {
      id: number;
      productId: number;
      thumbnail: string;
      medium: string;
      large: string;
    } | null;
  };
  variations: Variation[];
  selectedColor: string | null;
  selectedVariation: Variation | null;
  onColorChange: (color: string) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  product,
  variations,
  selectedColor,
  selectedVariation,
  onColorChange,
}) => {
  const getImageUrl = (): string => {
    if (selectedVariation?.variationImageURL) {
      return selectedVariation.variationImageURL;
    }
    return product.featuredImage?.large || "/placeholder-image.jpg";
  };

  const colors = Array.from(new Set(variations.map(v => v.color)));

  return (
    <div>
      <Image
        src={getImageUrl()}
        alt={product.productName}
        width={400}
        height={400}
        className="w-full h-auto object-cover rounded-lg mb-4"
        priority
      />
      <div className="flex flex-wrap gap-2">
        {colors.map(color => {
          const variation = variations.find(v => v.color === color);
          return (
            <div
              key={color}
              className={`cursor-pointer w-15 h-15 rounded-md overflow-hidden ${
                selectedColor === color ? "ring-2 ring-blue-500" : ""
              }`}
              onClick={() => onColorChange(color)}
              title={color}
            >
              <Image
                src={variation?.variationImageURL || "/placeholder-image.jpg"}
                alt={`${product.productName} - ${color}`}
                width={60}
                height={60}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImageGallery;
