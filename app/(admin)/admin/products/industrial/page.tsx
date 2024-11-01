// pages/IndustrialTablePage.tsx
import React from "react";
import {
  fetchIndustrialCollectionTable,
  toggleProductPublish,
  deleteProduct,
} from "./actions";
import ProductTableWrapper from "./ProductTableWrapper";

export default async function SummerTablePage() {
  const result = await fetchIndustrialCollectionTable();

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="m-8">
      <ProductTableWrapper
        products={result.data}
        onTogglePublish={toggleProductPublish}
        onDelete={deleteProduct}
      />
    </div>
  );
}
