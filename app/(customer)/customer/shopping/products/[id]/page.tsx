import React from "react";
import { fetchProductById } from "./actions";
import ProductDetails from "./ProductDetails";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

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
      {/* Back to Express Shop Button at the Top */}
      <div className="ml-[-20px] mr-4 mb-8">
        <Button asChild variant="default" className="mb-4 ">
          <Link
            href="/customer/shopping/products"
            className="flex items-center"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Express Shop
          </Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-center">Product Details</h1>
      <div className="flex justify-center">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
