import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";

export type TableVariation = {
  id: string;
  productId: string;
  productName: string; // From parent product
  name: string;
  color: string;
  size: string;
  sku: string;
  sku2: string;
  variationImageURL: string;
  quantity: number;
  sellingPrice: number; // From parent product
  isPublished: boolean; // From parent product
  createdAt: Date; // From parent product
};

export interface ProductTableProps {
  products: TableVariation[];
  collectionName: string;
  onTogglePublish: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export type ProductWithRelations = Product & {
  dynamicPricing: DynamicPricing[];
  variations: Variation[];
  featuredImage: FeaturedImage | null;
};
