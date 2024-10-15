"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ProductWithRelations } from "./useProductById";
import { Variation } from "@prisma/client";
import Image from "next/image";

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

  // Get unique colors and sizes
  const colors = Array.from(new Set(product.variations.map(v => v.color)));
  const sizes = Array.from(new Set(product.variations.map(v => v.size)));

  // Update selected variation and max quantity when color or size changes
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
    setQuantity(1); // Reset quantity when variation changes
  }, [selectedColor, selectedSize, product.variations]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setSelectedSize(null);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedVariation) {
      alert("Please select a color and size");
      return;
    }
    console.log("Added to cart:", {
      product: product.productName,
      variation: selectedVariation,
      quantity,
    });
    // Here you would typically dispatch an action to add the item to the cart
  };

  // Helper function to get image URL
  const getImageUrl = (): string => {
    if (selectedVariation?.variationImageURL) {
      return selectedVariation.variationImageURL;
    }
    return product.featuredImage?.large || "/placeholder-image.jpg";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product.productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                const variation = product.variations.find(
                  v => v.color === color
                );
                return (
                  <div
                    key={color}
                    className={`cursor-pointer w-15 h-15 rounded-md overflow-hidden ${
                      selectedColor === color ? "ring-2 ring-blue-500" : ""
                    }`}
                    onClick={() => handleColorChange(color)}
                    title={color}
                  >
                    <Image
                      src={
                        variation?.variationImageURL || "/placeholder-image.jpg"
                      }
                      alt={`${product.productName} - ${color}`}
                      width={60}
                      height={60}
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <div
              className="text-gray-600 mb-4"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
            <p className="text-xl font-semibold mb-4">
              ${product.sellingPrice.toFixed(2)}
            </p>

            <div className="mb-4">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {colors.map(color => (
                  <Button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    variant={selectedColor === color ? "default" : "outline"}
                    className="w-auto h-auto px-3 py-2 rounded-md"
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <Label htmlFor="size">Size</Label>
              <Select
                onValueChange={handleSizeChange}
                value={selectedSize || undefined}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map(size => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="quantity">Quantity</Label>
              <Select
                onValueChange={value => setQuantity(Number(value))}
                value={quantity.toString()}
                disabled={maxQuantity === 0}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxQuantity }, (_, i) => i + 1).map(
                    num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
              {maxQuantity > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  {maxQuantity} in stock
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={!selectedVariation || maxQuantity === 0}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductDetails;
