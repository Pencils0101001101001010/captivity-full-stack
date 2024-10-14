// File: app/(customer)/customer/shopping/products/[id]/page.tsx
import { Suspense } from "react";
import { getProductById } from "./actions";
import ProductDetails from "./ProductDetails";
import { notFound } from "next/navigation";
import ProductDetailsSkeleton from "../_components/ProductDetailsSkeleton";
import LinkButton from "../_components/LinkButton";

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
    <div className="container mx-auto px-4 py-8">
      <LinkButton
        href="/customer/shopping/products"
        variant="default"
        className="custom-class"
      >
        Back to express shop
      </LinkButton>
      <h1 className="text-3xl font-bold mb-6 text-center">Product Details</h1>
      <Suspense fallback={<ProductDetailsSkeleton />}>
        <ProductDetails product={result.data} />
      </Suspense>
    </div>
  );
}
