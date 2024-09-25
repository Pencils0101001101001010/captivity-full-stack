// pages/products/page.tsx
import React from "react";
import { fetchPreCurvedPeaksIds } from "./actions";
import prisma from "@/lib/prisma";
import { validateProduct } from "@/lib/validation";
import ProductCard from "./ProductCard";

const ProductPage = async () => {
  // Fetch product IDs
  const { preCurvedPeaksUnderLeisureIds, error } =
    await fetchPreCurvedPeaksIds();

  if (error) {
    return <div>Failed to load product data</div>;
  }

  if (
    !preCurvedPeaksUnderLeisureIds ||
    preCurvedPeaksUnderLeisureIds.length === 0
  ) {
    return <div>No products found</div>;
  }

  // Fetch each product's details
  const products = await Promise.all(
    preCurvedPeaksUnderLeisureIds.map(async (id) => {
      const product = await prisma.product.findUnique({ where: { id } }); // Fetch product by ID
      return validateProduct(product); // Validate product data
    })
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Pre-Curved Peaks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            sku={product.sku}
            description={product.shortDescription}
            imageUrl={product.imageUrl}
            isInStock={product.inStock}
            isFeatured={product.isFeatured}
            allowReviews={product.allowReviews}
            categories={product.categories}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
