// pages/KidsTablePage.tsx
import React from "react";
import {
  fetchAfricanCollectionTable,
  toggleProductPublish,
  deleteProduct,
} from "./actions";
import ProductTableWrapper from "./ProductTableWrapper";

export default async function AfricanTablePage() {
  const result = await fetchAfricanCollectionTable();

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
