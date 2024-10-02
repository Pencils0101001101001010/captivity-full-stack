import React from "react";
import { fetchProductById } from "./actions";
import ProductCard from "./ProductCard";

export default async function Page({ params }: { params: { id: string } }) {
  const productId = parseInt(params.id, 10);
  const result = await fetchProductById(productId);

  if (!result.success) {
    return <div>Error: {result.error}</div>;
  }

  const product = result.data;

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <ProductCard product={product} />
    </div>
  );
}
