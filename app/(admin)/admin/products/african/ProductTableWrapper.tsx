"use client";

import { useRouter } from "next/navigation";
import { ProductTableWrapperProps } from "../_types/table";
import ProductTable from "../_components/ProductTable";
import { useCallback } from "react";

export default function ProductTableWrapper({
  products,
  onTogglePublish,
  onDelete,
}: ProductTableWrapperProps) {
  const router = useRouter();

  const handleTogglePublish = useCallback(
    async (id: string) => {
      const result = await onTogglePublish(id);
      // Don't refresh at all since the server action handles revalidation
    },
    [onTogglePublish]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      const result = await onDelete(id);
      // Don't refresh at all since the server action handles revalidation
    },
    [onDelete]
  );

  const handleEdit = useCallback(
    (id: string) => {
      router.push(`/admin/products/edit/${id}`);
    },
    [router]
  );

  const handleView = useCallback(
    (id: string) => {
      router.push(`/admin/products/view/${id}`);
    },
    [router]
  );

  return (
    <ProductTable
      products={products}
      collectionName="African"
      onTogglePublish={handleTogglePublish}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onView={handleView}
    />
  );
}
