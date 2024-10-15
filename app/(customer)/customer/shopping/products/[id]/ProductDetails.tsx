"use client"
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

  useEffect(() => {
    console.log(
      "Full product data structure:",
      JSON.stringify(product, null, 2)
    );
  }, [product]);

  // Get unique colors and sizes
  const colors = Array.from(new Set(product.variations.map(v => v.color)));
  const sizes = Array.from(new Set(product.variations.map(v => v.size)));

  // Get unique variations by color
  const colorVariations = colors
    .map(color => product.variations.find(v => v.color === color))
    .filter((v): v is Variation => v !== undefined);

  // Update selected variation when color or size changes
  useEffect(() => {
    if (selectedColor && selectedSize) {
      const variation = product.variations.find(
        v => v.color === selectedColor && v.size === selectedSize
      );
      setSelectedVariation(variation || null);
      setQuantity(1); // Reset quantity when variation changes
    }
  }, [selectedColor, selectedSize, product.variations]);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (!sizes.includes(selectedSize || "")) {
      setSelectedSize(null);
    }
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

  // Helper function to get contrasting text color
  const getContrastColor = (hexColor: string) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
  };

  // Helper function to get image URL
  const getImageUrl = (): string => {
    if (selectedVariation?.variationImageURL) {
      return selectedVariation.variationImageURL;
    }
    if (product.featuredImage?.medium) {
      return product.featuredImage.medium;
    }
    return "/placeholder-image.jpg"; // Replace with your actual placeholder image path
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
            />
            <div className="flex flex-wrap gap-2">
              {colorVariations.map(variation => (
                <Image
                  key={variation.id}
                  src={variation.variationImageURL}
                  alt={`${product.productName} - ${variation.color}`}
                  width={60}
                  height={60}
                  className={`w-15 h-15 object-cover rounded-md cursor-pointer ${selectedColor === variation.color ? "border-2 border-blue-500" : ""}`}
                  onClick={() => handleColorChange(variation.color)}
                />
              ))}
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
                {colors.map(color => {
                  const hexColor =
                    color.toLowerCase() === "grey melange"
                      ? "#D3D3D3"
                      : color.toLowerCase();
                  return (
                    <Button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      variant={selectedColor === color ? "default" : "outline"}
                      className="w-auto h-auto px-3 py-2 rounded-md"
                      style={{
                        backgroundColor: hexColor,
                        color: getContrastColor(hexColor),
                        border:
                          selectedColor === color ? "2px solid black" : "none",
                      }}
                    >
                      {color}
                    </Button>
                  );
                })}
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

            {selectedVariation && (
              <div className="mb-4">
                <Label htmlFor="quantity">Quantity</Label>
                <Select
                  value={quantity.toString()}
                  onValueChange={value => setQuantity(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: selectedVariation.quantity },
                      (_, i) => i + 1
                    ).map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleAddToCart}
          className="w-full"
          disabled={!selectedVariation}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductDetails;
