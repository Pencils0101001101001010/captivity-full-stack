import React, { useMemo, memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Product,
  DynamicPricing,
  FeaturedImage,
  Variation,
} from "@prisma/client";
import ViewMore from "@/app/(customer)/_components/ViewMore";
import { Button } from "@/components/ui/button";
import { ProductImage, ProductPrice } from "./ProductCardComponents";
import { StarRating } from "./StarRating";

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
  variations?: Variation[];
};

interface ProductCardProps {
  product: ProductWithRelations;
  selectedVariation?: Variation;
}

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, selectedVariation }) => {
    const defaultVariation = product.variations?.[0];
    const currentVariation = selectedVariation || defaultVariation;

    const viewMoreUrl = useMemo(
      () =>
        currentVariation
          ? `/customer/shopping/${product.id}/${currentVariation.id}`
          : `/customer/shopping/${product.id}`,
      [product.id, currentVariation]
    );

    return (
      <Card className="h-auto overflow-hidden shadow-2xl shadow-black transition-transform duration-300 hover:scale-95 bg-white">
        <ProductImage
          imageSrc={product.featuredImage?.medium}
          alt={product.productName}
        />
        <CardContent className="p-4">
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {product.productName}
          </h3>
          <ProductPrice
            dynamicPricing={product.dynamicPricing}
            sellingPrice={product.sellingPrice}
          />
          <div className="mb-4">
            <StarRating />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ViewMore
              href={viewMoreUrl}
              variant="default"
              size="sm"
              className="w-full bg-[#2c3e50] hover:bg-[#34495e] text-sm py-2 flex justify-center items-center"
            >
              View More
            </ViewMore>
            <Button
              variant="destructive"
              size="sm"
              className="w-full text-sm py-2"
              onClick={() => {
                window.location.href = viewMoreUrl;
              }}
            >
              Check it out
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    const prevImage = prevProps.product.featuredImage?.medium;
    const nextImage = nextProps.product.featuredImage?.medium;
    const prevVariationId = prevProps.selectedVariation?.id;
    const nextVariationId = nextProps.selectedVariation?.id;

    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.productName === nextProps.product.productName &&
      prevProps.product.sellingPrice === nextProps.product.sellingPrice &&
      prevImage === nextImage &&
      prevVariationId === nextVariationId &&
      prevProps.product.dynamicPricing[0]?.amount ===
        nextProps.product.dynamicPricing[0]?.amount
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
