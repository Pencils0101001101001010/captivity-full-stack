"use client";

import { useRouter } from "next/navigation";
import ProductTable from "./ProductTable";
import { TableProduct } from "../_types/table";

type TogglePublishResult =
  | { success: true; message: string }
  | { success: false; error: string };

type DeleteResult = {
  success: boolean;
  message: string;
};

interface ProductTableWrapperProps {
  products: TableProduct[];
  onTogglePublish: (productId: string) => Promise<TogglePublishResult>;
  onDelete: (productId: string) => Promise<DeleteResult>;
}

export default function ProductTableWrapper({
  products,
  onTogglePublish,
  onDelete,
}: ProductTableWrapperProps) {
  const router = useRouter();

  const handleTogglePublish = async (id: string) => {
    await onTogglePublish(id);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
    router.refresh();
  };

  return (
    <ProductTable
      products={products}
      collectionName="Summer"
      onTogglePublish={handleTogglePublish}
      onDelete={handleDelete}
      onEdit={id => router.push(`/admin/products/edit/${id}`)}
      onView={id => router.push(`/admin/products/view/${id}`)}
    />
  );
}
