import { Product, Variation, DynamicPricing, FeaturedImage } from "@prisma/client";

export type VariationWithRelations = Variation & {
  product: Product & {
    dynamicPricing: DynamicPricing[];
    featuredImage: FeaturedImage | null;
  };
};

export type ProductAndVariation = {
  product: Product & {
    dynamicPricing: DynamicPricing[];
    variations: Variation[];
    featuredImage: FeaturedImage | null;
  };
  variation: Variation;
};

export interface VariationSelectorProps {
  variation: Variation;
  isSelected: boolean;
  onSelect: (variation: Variation) => void;
}

export interface ColorSelectorProps {
  colors: string[];
  selectedColor: string | undefined;
  variations: Variation[];
  onColorSelect: (color: string) => void;
  productName: string;
}

export interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | undefined;
  onSizeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}