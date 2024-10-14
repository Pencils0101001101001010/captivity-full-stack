import { Suspense } from "react";
import { getProductById } from "./actions";
import ProductDetails from "./ProductDetails";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = parseInt(params.id);
  const result = await getProductById(productId);

  if (!result.success) {
    notFound();
  }

  return (
    <div>
      <h1>Product Details</h1>
      <Suspense fallback={<div>Loading product details...</div>}>
        <ProductDetails product={result.data} />
      </Suspense>
    </div>
  );
}
