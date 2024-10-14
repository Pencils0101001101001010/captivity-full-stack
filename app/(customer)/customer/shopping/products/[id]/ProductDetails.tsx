"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProductWithRelations } from "./useProductById"; // Import from where it's defined
import { Variation } from "@prisma/client"; // Import Variation type from Prisma
import Image from "next/image";

interface ProductDetailsProps {
  product: ProductWithRelations;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);

  const handleVariationChange = (variationId: string) => {
    const variation = product.variations.find(
      v => v.id === parseInt(variationId)
    );
    setSelectedVariation(variation || null);
  };

  const handleAddToCart = () => {
    if (!selectedVariation) {
      alert("Please select a variation");
      return;
    }
    console.log("Added to cart:", {
      product: product.productName,
      variation: selectedVariation,
      quantity,
    });
    // Here you would typically dispatch an action to add the item to the cart
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{product.productName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            {product.featuredImage?.medium ? (
              <Image
                src={product.featuredImage.medium}
                alt={product.productName}
                width={400}
                height={400}
                className="w-full h-auto object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
                No image available
              </div>
            )}
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
              <Label htmlFor="variation">Variation</Label>
              <Select onValueChange={handleVariationChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a variation" />
                </SelectTrigger>
                <SelectContent>
                  {product.variations.map(variation => (
                    <SelectItem
                      key={variation.id}
                      value={variation.id.toString()}
                    >
                      {variation.name} - {variation.color} - {variation.size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-4">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={e =>
                  setQuantity(Math.max(1, parseInt(e.target.value)))
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full">
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductDetails;
