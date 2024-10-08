"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
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
import { Badge } from "@/components/ui/badge";
import AddToCart from "./AddToCart";
import { calculateAvailableStock } from "./actions"; // Ensure this import path is correct

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    inStock: boolean;
    attribute1Values: string | null;
    attribute2Values: string | null;
    regularPrice: number | null;
    imageUrl: string;
  };
}

interface ColorSizePair {
  color: string;
  size: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [selectedPair, setSelectedPair] = useState<ColorSizePair | null>(null);
  const [availableStock, setAvailableStock] = useState<number>(0);
  const [selectedQuantity, setSelectedQuantity] = useState<string>("1");

  const colorSizePairs: ColorSizePair[] = parseColorSizePairs(
    product.attribute1Values,
    product.attribute2Values
  );

  useEffect(() => {
    if (colorSizePairs.length > 0) {
      setSelectedPair(colorSizePairs[0]);
    }
  }, []);

  useEffect(() => {
    const updateStock = async () => {
      if (selectedPair) {
        const stock = await calculateAvailableStock(
          product.id,
          selectedPair.color,
          selectedPair.size
        );
        setAvailableStock(stock);
      }
    };
    updateStock();
  }, [selectedPair, product.id]);

  function parseColorSizePairs(
    colors: string | null,
    sizes: string | null
  ): ColorSizePair[] {
    if (!colors || !sizes) return [];

    const colorArray = colors.split(",").map(c => c.trim());
    const sizeArray = sizes.split(",").map(s => s.trim());

    return colorArray.map((color, index) => ({
      color,
      size: sizeArray[index] || "",
    }));
  }

  const uniqueColors = Array.from(
    new Set(colorSizePairs.map(pair => pair.color))
  );
  const uniqueSizes = Array.from(
    new Set(colorSizePairs.map(pair => pair.size))
  );

  const handleColorChange = (color: string) => {
    const newPair =
      colorSizePairs.find(
        pair => pair.color === color && pair.size === selectedPair?.size
      ) || colorSizePairs.find(pair => pair.color === color);
    if (newPair) setSelectedPair(newPair);
  };

  const handleSizeChange = (size: string) => {
    const newPair =
      colorSizePairs.find(
        pair => pair.size === size && pair.color === selectedPair?.color
      ) || colorSizePairs.find(pair => pair.size === size);
    if (newPair) setSelectedPair(newPair);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{product.name}</CardTitle>
        <Badge
          variant={product.inStock ? "default" : "destructive"}
          className="text-sm"
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2">
            <div className="aspect-square relative w-full">
              <Image
                src={product.imageUrl}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <Select
                onValueChange={handleColorChange}
                value={selectedPair?.color || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueColors.map(color => (
                    <SelectItem key={color} value={color}>
                      {color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Size
              </label>
              <Select
                onValueChange={handleSizeChange}
                value={selectedPair?.size || ""}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSizes.map(size => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <Select
                onValueChange={value => setSelectedQuantity(value)}
                value={selectedQuantity}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Quantity" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(availableStock)].map((_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-600">
              Available Stock: {availableStock}
            </p>
            <p className="text-3xl font-bold text-primary">
              ${product.regularPrice?.toFixed(2) ?? "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-6">
        <AddToCart
          quantity={parseInt(selectedQuantity)}
          productId={product.id}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
