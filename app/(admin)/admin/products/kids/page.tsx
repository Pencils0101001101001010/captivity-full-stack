// pages/KidsTablePage.tsx
import React from "react";
import {
  fetchSummerCollectionTable,
  toggleProductPublish,
  deleteProduct,
} from "./actions";
import ProductTableWrapper from "../_components/ProductTableWrapper";

export default async function SummerTablePage() {
  const result = await fetchSummerCollectionTable();

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
