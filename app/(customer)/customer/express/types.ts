// types/summerCollection.ts

import { UserRole } from "@prisma/client";

export type Product = {
  id: number;
  productName: string;
  category: string[];
  description: string;
  sellingPrice: number;
  isPublished: boolean;
  variations: Variation[];
  dynamicPricing: DynamicPricing[];
  featuredImage: FeaturedImage | null;
};

export type Variation = {
  id: number;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
};

export type DynamicPricing = {
  id: number;
  from: string;
  to: string;
  type: string;
  amount: string;
};

export type FeaturedImage = {
  thumbnail: string;
  medium: string;
  large: string;
};

export type FetchProductByIdResult =
  | { success: true; data: Product }
  | { success: false; error: string };
