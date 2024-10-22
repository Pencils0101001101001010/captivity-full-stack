import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};

export interface ProductDetailsProps {
  product: ProductWithRelations;
}

export interface ProductImageProps {
  selectedVariation: Variation | null;
  product: ProductWithRelations;
  uniqueColors: string[];
  onColorSelect: (color: string) => void;
}

export interface ProductCardProps {
  product: ProductWithRelations;
}
