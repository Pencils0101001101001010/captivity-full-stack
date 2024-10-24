import React, { useMemo, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Product, DynamicPricing, FeaturedImage } from "@prisma/client";
import ViewMore from "@/app/(customer)/_components/ViewMore";

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
};

interface ProductCardProps {
  product: ProductWithRelations;
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

    return <p className="text-muted-foreground">R {price.toFixed(2)}</p>;
  }
);

ProductPrice.displayName = "ProductPrice";

const DEFAULT_IMAGE = "/placeholder.jpg";

const ProductImage = memo(
  ({ imageSrc, alt }: { imageSrc?: string | null; alt: string }) => {
    const imageUrl = useMemo(() => imageSrc || DEFAULT_IMAGE, [imageSrc]);

    return (
      <div className="relative w-full h-52">
        <Image
          src={imageUrl}
          alt={alt}
          layout="fill"
          objectFit="cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
          loading="lazy"
        />
      </div>
    );
  }
);

ProductImage.displayName = "ProductImage";

const ProductCard: React.FC<ProductCardProps> = memo(
  ({ product }) => {
    const productUrl = useMemo(
      () => `/customer/shopping/${product.id}`,
      [product.id]
    );

    return (
      <Card className="h-[380px] w-full overflow-hidden cursor-pointer transition-transform hover:scale-105 shadow-2xl dark:shadow-none bg-card">
        <ProductImage
          imageSrc={product.featuredImage?.medium}
          alt={product.productName}
        />
        <CardContent className="p-3 space-y-2">
          <h3 className="text-lg font-semibold truncate text-foreground">
            {product.productName}
          </h3>
          <ProductPrice
            dynamicPricing={product.dynamicPricing}
            sellingPrice={product.sellingPrice}
          />
          <ViewMore href={productUrl} variant="default" size="md">
            View More Details
          </ViewMore>
        </CardContent>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    const prevImage = prevProps.product.featuredImage?.medium;
    const nextImage = nextProps.product.featuredImage?.medium;

    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.productName === nextProps.product.productName &&
      prevProps.product.sellingPrice === nextProps.product.sellingPrice &&
      prevImage === nextImage &&
      prevProps.product.dynamicPricing[0]?.amount ===
        nextProps.product.dynamicPricing[0]?.amount
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
