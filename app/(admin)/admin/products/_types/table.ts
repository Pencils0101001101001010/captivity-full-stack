// types/table.ts

import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";

// Base product variation type matching your Prisma schema
export interface TableVariation {
  id: string;
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  productId: string;
}

// Base product type for table display
export interface TableProduct {
  id: string;
  productName: string;
  sellingPrice: number;
  variations: TableVariation[];
  isPublished: boolean;
  createdAt: Date;
}

// Props for the ProductTable component
export interface ProductTableProps {
  products: TableProduct[];
  collectionName: string;
  onTogglePublish: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

// Props for the ProductTableWrapper component
export interface ProductTableWrapperProps {
  products: TableProduct[];
  onTogglePublish: (productId: string) => Promise<TogglePublishResult>;
  onDelete: (productId: string) => Promise<DeleteResult>;
}

// Response types for server actions
export type TogglePublishResult =
  | { success: true; message: string }
  | { success: false; error: string };

export type DeleteResult = {
  success: boolean;
  message: string;
};

// Type for a product with all its Prisma relations
export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};
