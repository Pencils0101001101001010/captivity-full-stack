import { Product, Variation } from "@prisma/client";

export type ProductWithRelations = Product & {
  variations: Variation[];
  featuredImage: { medium: string } | null;
};

export type ProductDetailsProps = {
  product: ProductWithRelations;
};

export type AddToCartButtonProps = {
  selectedVariation: Variation | null;
  quantity: number;
  disabled: boolean;
};

export type ColorSelectorProps = {
  colors: string[];
  selectedColor: string | undefined;
  variations: Variation[];
  onColorSelect: (color: string) => void;
  productName: string;
};

export type SizeSelectorProps = {
  sizes: string[];
  selectedSize: string | undefined;
  onSizeSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type QuantitySelectorProps = {
  quantity: number;
  maxQuantity: number;
  onQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export type ProductImageProps = {
  selectedVariation: Variation | null;
  product: ProductWithRelations;
  uniqueColors: string[];
  onColorSelect: (color: string) => void;
};
