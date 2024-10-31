"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { deleteProduct, toggleProductPublish } from "../summer/actions";
import ProductTable from "./Table";

type Props = {
  initialProducts: any[]; // Replace 'any' with your product type
};

export default function ProductTableWrapper({ initialProducts }: Props) {
  const router = useRouter();

  const handleTogglePublish = async (id: string) => {
    await toggleProductPublish(id);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    router.refresh();
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/products/edit/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/admin/products/view/${id}`);
  };

  return (
    <ProductTable
      products={initialProducts}
      collectionName="Summer"
      onTogglePublish={handleTogglePublish}
      onDelete={handleDelete}
      onEdit={handleEdit}
      onView={handleView}
    />
  );
}
