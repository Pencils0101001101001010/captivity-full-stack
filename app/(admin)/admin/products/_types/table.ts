export type TableProduct = {
  id: string;
  productName: string;
  sellingPrice: number;
  variations: {
    color: string;
    size: string;
    quantity: number;
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
