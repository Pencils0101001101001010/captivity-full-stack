import React, { memo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductImage, ProductPrice } from "./ProductCardComponents";
import { ProductWithRelations } from "../types";
import { useColorStore } from "../../../_store/useColorStore";
import { VariationWithRelations } from "../../[id]/[variationId]/_types/types";
import { fetchVariationById } from "../../[id]/[variationId]/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import VariationDetails from "../../[id]/[variationId]/VariationDetails";

interface ProductCardProps {
  product: ProductWithRelations;
  selectedColors: string[];
  selectedSizes: string[];
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, selectedColors, selectedSizes }) => {
    const setSelectedColor = useColorStore(state => state.setSelectedColor);
    const defaultVariation = product.variations?.[0];

    // Find first matching variation based on selected filters
    const currentVariation =
      product.variations?.find(
        v =>
          selectedColors.some(
            color => v.color.toLowerCase() === color.toLowerCase()
          ) &&
          (!selectedSizes.length || selectedSizes.includes(v.size))
      ) || defaultVariation;

    const totalStock = product.variations.reduce(
      (sum, variation) => sum + variation.quantity,
      0
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [variationData, setVariationData] =
      useState<VariationWithRelations | null>(null);

    const handleViewMore = async () => {
      if (currentVariation?.id) {
        const result = await fetchVariationById(currentVariation.id);
        if (result.success) {
          setVariationData(result.data);
          setIsModalOpen(true);
        }
      }
    };

    const handleShopClick = (e: React.MouseEvent) => {
      if (currentVariation?.color) {
        setSelectedColor(product.id, currentVariation.color);
      }
    };

    return (
      <>
        <Card className="h-auto overflow-hidden shadow-2xl shadow-black transition-transform duration-300 hover:scale-95">
          <div className="relative">
            <ProductImage
              imageSrc={
                currentVariation?.variationImageURL ||
                product.featuredImage?.large
              }
              alt={product.productName}
            />
          </div>
          <CardContent className="p-4">
            <h1 className="text-md font-md text-gray-800 font-semibold mb-2 line-clamp-1 hover:line-clamp-none">
              {product.productName}
            </h1>
            <div className="flex-col justify-start items-center mb-2">
              <div className="text-sm text-gray-600">
                Total Stock: {totalStock}
              </div>
              <div className="text-sm text-gray-600">
                {currentVariation && (
                  <span>
                    {currentVariation.color} Stock: {currentVariation.quantity}
                  </span>
                )}
              </div>
            </div>

            <ProductPrice
              dynamicPricing={product.dynamicPricing}
              sellingPrice={product.sellingPrice}
            />

            <div className="grid grid-cols-2 gap-2">
              <Button
                onClick={handleViewMore}
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
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
            <DialogTitle className="text-xl font-semibold">
              {product.productName}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              View detailed information about this product variation.
            </DialogDescription>
            {variationData && <VariationDetails data={variationData} />}
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

ProductCard.displayName = "ProductCard";
export default ProductCard;
