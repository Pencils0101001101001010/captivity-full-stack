import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Product, DynamicPricing, FeaturedImage } from "@prisma/client";

type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
};

type ProductCardProps = {
  product: ProductWithRelations;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Get the current price from dynamicPricing or use the sellingPrice
  const currentPrice =
    product.dynamicPricing.length > 0
      ? parseFloat(product.dynamicPricing[0].amount)
      : product.sellingPrice;

  return (
    <Link href={`/product/${product.id}`} passHref>
      <Card className="w-64 h-80 overflow-hidden cursor-pointer transition-transform hover:scale-105">
        <div className="relative w-full h-52">
          <Image
            src={product.featuredImage?.medium || "/placeholder.jpg"}
            alt={product.productName}
            layout="fill"
            objectFit="cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold truncate">
            {product.productName}
          </h3>
          <p className="text-sm text-gray-600">R {currentPrice.toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
