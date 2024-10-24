import React, { useMemo, memo } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Product,
  DynamicPricing,
  FeaturedImage,
  Variation,
} from "@prisma/client";
import ViewMore from "@/app/(customer)/_components/ViewMore";
import { Button } from "@/components/ui/button";

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
  variations?: Variation[];
};

interface ProductCardProps {
  product: ProductWithRelations;
  selectedVariation?: Variation;
}

const ProductPrice = memo(
  ({
    dynamicPricing,
    sellingPrice,
  }: {
    dynamicPricing: DynamicPricing[];
    sellingPrice: number;
  }) => {
    const price =
      dynamicPricing.length > 0
        ? parseFloat(dynamicPricing[0].amount)
        : sellingPrice;

    return (
      <p className="text-gray-600 font-medium mb-4">R {price.toFixed(2)}</p>
    );
  }
);

ProductPrice.displayName = "ProductPrice";

const DEFAULT_IMAGE = "/placeholder.jpg";

const ProductImage = memo(
  ({ imageSrc, alt }: { imageSrc?: string | null; alt: string }) => {
    const imageUrl = useMemo(() => imageSrc || DEFAULT_IMAGE, [imageSrc]);

    return (
      <div className="relative w-full aspect-square">
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
    );
  }
);

ProductImage.displayName = "ProductImage";

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product, selectedVariation }) => {
    // Initialize with first variation if none selected and variations exist
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
          <div className="flex gap-2">
            <ViewMore
              href={viewMoreUrl}
              variant="default"
              size="sm"
              className="flex-1 bg-[#2c3e50] hover:bg-[#34495e] text-sm py-2"
            >
              View More
            </ViewMore>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 text-sm py-2"
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
