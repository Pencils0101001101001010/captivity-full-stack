// components/ProductTableWrapper.tsx
"use client";

import { useRouter } from "next/navigation";
import { ProductTableWrapperProps, TableProduct } from "../_types/table";
import ProductTable from "../_components/ProductTable";

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
      collectionName="Fashion"
      onTogglePublish={handleTogglePublish}
      onDelete={handleDelete}
      onEdit={id => router.push(`/admin/products/edit/${id}`)}
      onView={id => router.push(`/admin/products/view/${id}`)}
    />
  );
}
