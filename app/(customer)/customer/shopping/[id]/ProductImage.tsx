import React from "react";
import Image from "next/image";
import { ProductImageProps } from "./types";

const ProductImage: React.FC<ProductImageProps> = ({
  selectedVariation,
  product,
  uniqueColors,
  onColorSelect,
}) => {
  return (
    <div className="w-full md:w-1/2 pr-0 md:pr-6 mb-4 md:mb-0">
      <div className="relative w-full h-[340px] mb-4">
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
                onClick={() => onColorSelect(color)}
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
  );
};

export default ProductImage;
