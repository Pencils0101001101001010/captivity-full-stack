import React from "react";
import { fetchSummerCollectionTable } from "./actions";
import ProductTableWrapper from "../_components/ProductTableWrapper";

export default async function SummerTablePage() {
  const result = await fetchSummerCollectionTable();

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return <ProductTableWrapper initialProducts={result.data} />;
}
