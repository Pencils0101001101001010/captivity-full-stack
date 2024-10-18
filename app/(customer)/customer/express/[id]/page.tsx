import React from "react";
import { fetchProductById } from "./actions";
import ProductIdDetails from "./ProductIdDetails";
import { FetchProductByIdResult } from "../types";

interface UniversalCollectionPageProps {
  params: { id: string };
}

const UniversalCollectionPage = async ({
  params,
}: UniversalCollectionPageProps) => {
  const result: FetchProductByIdResult = await fetchProductById(params.id);

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Details</h1>
      <ProductIdDetails product={result.data} />
    </div>
  );
};

export default UniversalCollectionPage;
