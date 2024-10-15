// components/ProductInfo.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Variation } from "@prisma/client";

interface ProductInfoProps {
  product: {
    productName: string;
    description: string;
    sellingPrice: number;
  };
  variations: Variation[];
  selectedColor: string | null;
  selectedSize: string | null;
  selectedVariation: Variation | null;
  quantity: number;
  maxQuantity: number;
  onColorChange: (color: string) => void;
  onSizeChange: (size: string) => void;
  onQuantityChange: (quantity: number) => void;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  variations,
  selectedColor,
  selectedSize,
  selectedVariation,
  quantity,
  maxQuantity,
  onColorChange,
  onSizeChange,
  onQuantityChange,
}) => {
  const colors = Array.from(new Set(variations.map(v => v.color)));
  const sizes = Array.from(new Set(variations.map(v => v.size)));

  return (
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
              onClick={() => onColorChange(color)}
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
        <Select onValueChange={onSizeChange} value={selectedSize || undefined}>
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
        {maxQuantity > 0 ? (
          <Select
            onValueChange={value => onQuantityChange(Number(value))}
            value={quantity.toString()}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: maxQuantity }, (_, i) => i + 1).map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <p className="text-sm text-red-500 mt-1">
            {selectedSize ? "No stock in this size" : "Select a size"}
          </p>
        )}
        {maxQuantity > 0 && (
          <p className="text-sm text-gray-500 mt-1">{maxQuantity} in stock</p>
        )}
      </div>
    </div>
  );
};

export default ProductInfo;
