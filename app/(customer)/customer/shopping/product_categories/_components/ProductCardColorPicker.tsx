import React, { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductImage, ProductPrice } from "./ProductCardComponents";
import { StarRating } from "./StarRating";
import { ProductWithRelations } from "../types";
import { useColorStore } from "../../../_store/useColorStore";

interface ProductCardProps {
  product: ProductWithRelations;
  selectedColor: string | null;
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, selectedColor }) => {
    const setSelectedColor = useColorStore(state => state.setSelectedColor);
    const defaultVariation = product.variations?.[0];
    const currentVariation =
      product.variations?.find(v => v.color === selectedColor) ||
      defaultVariation;

    const handleShopClick = (e: React.MouseEvent) => {
      if (selectedColor) {
        // Store the selected color before navigation
        setSelectedColor(product.id, selectedColor);
      }
    };

    return (
      <Card className="h-auto overflow-hidden shadow-2xl shadow-black transition-transform duration-300 hover:scale-95">
        <ProductImage
          imageSrc={
            currentVariation?.variationImageURL || product.featuredImage?.large
          }
          alt={product.productName}
        />
        <CardContent className="p-4">
          <h1 className="text-md font-md text-gray-800 font-semibold mb-2 line-clamp-1 hover:line-clamp-none">
            {product.productName}
          </h1>
          <ProductPrice
            dynamicPricing={product.dynamicPricing}
            sellingPrice={product.sellingPrice}
          />
          <div className="mb-4">
            <StarRating />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="default"
              size="sm"
              className="w-full bg-[#2c3e50] hover:bg-[#34495e] text-sm py-2"
            >
              View More
            </Button>
            <Link
              href={`/customer/shopping/${product.id}`}
              className="w-full"
              onClick={handleShopClick}
            >
              <Button
                variant="destructive"
                size="sm"
                className="w-full text-sm py-2"
              >
                Shop
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }
);

ProductCard.displayName = "ProductCard";
export default ProductCard;
