import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { ProductFormValues } from "@/lib/validation";
import UpdateProductForm from "./EditProduct";

async function getProduct(id: string): Promise<ProductFormValues | null> {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!product) {
    return null;
  }

  // Convert the product data to match ProductFormValues
  return {
    type: product.type,
    sku: product.sku,
    name: product.name,
    published: product.published,
    isFeatured: product.isFeatured,
    visibility: product.visibility,
    shortDescription: product.shortDescription || "",
    taxStatus: product.taxStatus,
    inStock: product.inStock,
    backordersAllowed: product.backordersAllowed,
    soldIndividually: product.soldIndividually,
    allowReviews: product.allowReviews,
    regularPrice: product.regularPrice ?? 0, // Provide a default value of 0 if null
    categories: product.categories ? product.categories.split(", ") : [],
    tags: product.tags ? product.tags.split(", ") : [],
    imageUrl: product.imageUrl || "",
    upsells: product.upsells ? product.upsells.split(", ") : [],
    position: product.position,
    attribute1Name: product.attribute1Name || "",
    attribute1Values: product.attribute1Values
      ? product.attribute1Values.split(", ")
      : [],
    attribute2Name: product.attribute2Name || "",
    attribute2Values: product.attribute2Values
      ? product.attribute2Values.split(", ")
      : [],
    stock: product.stock ?? 0, // Provide a default value of 0 if null
  };
}

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <h1>Edit Product</h1>
      <UpdateProductForm id={parseInt(params.id, 10)} initialData={product} />
    </div>
  );
}
