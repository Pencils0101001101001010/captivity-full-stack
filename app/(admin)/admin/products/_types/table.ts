import {
  Product,
  DynamicPricing,
  Variation,
  FeaturedImage,
} from "@prisma/client";

export type TableProduct = {
  id: string;
  productName: string;
  sellingPrice: number;
  variations: {
    id: string;
    name: string;
    color: string;
    size: string;
    sku: string;
    sku2: string;
    variationImageURL: string; // Matches the Prisma schema
    quantity: number;
    productId: string;
  }[];
  isPublished: boolean;
  createdAt: Date;
};

export interface ProductTableProps {
  products: TableProduct[];
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
