// components/ProductDetails.tsx
"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductWithRelations } from "./useProductById";
import { Variation } from "@prisma/client";
import ImageGallery from "./ImageGallery";
import ProductInfo from "./ProductInfo";
import AddToCartButton from "../../cart/AddToCartButton";

interface ProductDetailsProps {
  product: ProductWithRelations;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [maxQuantity, setMaxQuantity] = useState<number>(0);

  useEffect(() => {
    let variation: Variation | undefined;
    if (selectedColor && selectedSize) {
      variation = product.variations.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
    } else if (selectedColor) {
      variation = product.variations.find(v => v.color === selectedColor);
    }
    setSelectedVariation(variation || null);
    setMaxQuantity(variation ? variation.quantity : 0);
    setQuantity(variation && variation.quantity > 0 ? 1 : 0);
  }, [selectedColor, selectedSize, product.variations]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-2xl shadow-black">
      <CardHeader>
        <CardTitle>{product.productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageGallery
            product={{
              productName: product.productName,
              featuredImage: product.featuredImage,
            }}
            variations={product.variations}
            selectedColor={selectedColor}
            selectedVariation={selectedVariation}
            onColorChange={handleColorChange}
          />
          <ProductInfo
            product={product}
            variations={product.variations}
            selectedColor={selectedColor}
            selectedSize={selectedSize}
            selectedVariation={selectedVariation}
            quantity={quantity}
            maxQuantity={maxQuantity}
            onColorChange={handleColorChange}
            onSizeChange={handleSizeChange}
            onQuantityChange={handleQuantityChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <AddToCartButton
          productId={product.id}
          selectedVariation={selectedVariation}
          quantity={quantity}
          maxQuantity={selectedVariation ? selectedVariation.quantity : 0}
        />
      </CardFooter>
    </Card>
  );
};

export default ProductDetails;
